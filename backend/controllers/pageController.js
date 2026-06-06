import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pageRepository } from "../models/page.js";
import { userRepository } from "../models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedSectionTypes = new Set(["titre", "texte", "code", "image"]);

function parseBoolean(value) {
  return value === true || value === "true" || value === "1";
}

function normalizeSlug(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getExtension(filename) {
  const ext = path.extname(filename || "").toLowerCase();
  return ext || ".bin";
}

function getPageUploadDir(pageId) {
  return path.join(__dirname, "../uploads/pages", String(pageId));
}

async function readMultipartSection(request) {
  const fields = {};
  let imagePart = null;

  for await (const part of request.parts()) {
    if (part.file) {
      imagePart = {
        filename: part.filename,
        buffer: await part.toBuffer(),
      };
    } else {
      fields[part.fieldname] = part.value;
    }
  }

  return { fields, imagePart };
}

async function saveSectionImage(pageId, sectionId, imagePart) {
  const uploadDir = getPageUploadDir(pageId);
  await fs.promises.mkdir(uploadDir, { recursive: true });

  const extension = getExtension(imagePart.filename);
  const filePath = path.join(uploadDir, `${sectionId}${extension}`);
  await fs.promises.writeFile(filePath, imagePart.buffer);

  return `/uploads/pages/${pageId}/${sectionId}${extension}`;
}

async function deleteFileIfExists(filePath) {
  if (!filePath) return;
  const absolutePath = path.join(__dirname, `..${filePath}`);
  try {
    await fs.promises.unlink(absolutePath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error("Erreur lors de la suppression du fichier de section :", err.message);
    }
  }
}

async function requireAdminUser(request, reply) {
  const user = await userRepository.getUserById(request.user?.userId);
  if (!user || (user.GradeID !== 1 && user.GradeID !== 2)) {
    reply.status(403).send({ error: "Accès réservé aux administrateurs." });
    return null;
  }
  return user;
}

function buildPagePayload(body) {
  const titre = String(body?.titre || "").trim();
  const slug = normalizeSlug(body?.slug || titre);

  if (!titre) {
    return { error: "Le titre est requis." };
  }
  if (!slug) {
    return { error: "Le slug est requis." };
  }

  return {
    data: {
      ThemeID: body?.themeId ? Number(body.themeId) : null,
      Titre: titre,
      Slug: slug,
      Description: body?.description ? String(body.description).trim() : null,
      Ordre: Number(body?.ordre || 0),
      EstPubliee: parseBoolean(body?.estPubliee),
    },
  };
}

function buildThemePayload(body) {
  const nom = String(body?.nom || "").trim();
  const slug = normalizeSlug(body?.slug || nom);

  if (!nom) {
    return { error: "Le nom du thème est requis." };
  }
  if (!slug) {
    return { error: "Le slug du thème est requis." };
  }

  return {
    data: {
      Nom: nom,
      Slug: slug,
      Ordre: Number(body?.ordre || 0),
    },
  };
}

function buildSectionPayload(rawFields, pageId) {
  const type = String(rawFields?.type || "").trim();

  if (!allowedSectionTypes.has(type)) {
    return { error: "Type de section invalide." };
  }

  return {
    data: {
      PageID: pageId,
      Type: type,
      Titre: rawFields?.titre ? String(rawFields.titre).trim() : null,
      Contenu: rawFields?.contenu ? String(rawFields.contenu) : null,
      Langage: type === "code" && rawFields?.langage ? String(rawFields.langage).trim() : null,
      TexteAlt: type === "image" && rawFields?.texteAlt ? String(rawFields.texteAlt).trim() : null,
      Ordre: Number(rawFields?.ordre || 0),
    },
  };
}

export const pageController = {
  async listPublicLinks(request, reply) {
    const pages = await pageRepository.listPublicLinks();
    reply.send(pages);
  },

  async getPublicPage(request, reply) {
    const slug = normalizeSlug(request.params.slug);
    const page = await pageRepository.getPublicPageBySlug(slug);
    if (!page) {
      return reply.status(404).send({ error: "Page introuvable." });
    }
    reply.send(page);
  },

  async searchPublicPages(request, reply) {
    const query = String(request.query?.q || "").trim();
    if (query.length < 2) {
      return reply.send([]);
    }

    const results = await pageRepository.searchPublicPages(query);
    reply.send(results);
  },

  async listAdminPages(request, reply) {
    const user = await requireAdminUser(request, reply);
    if (!user) return;

    const pages = await pageRepository.listAdminPages();
    reply.send(pages);
  },

  async getAdminPage(request, reply) {
    const user = await requireAdminUser(request, reply);
    if (!user) return;

    const pageId = Number(request.params.pageId);
    const page = await pageRepository.getPageById(pageId);
    if (!page) {
      return reply.status(404).send({ error: "Page introuvable." });
    }
    reply.send(page);
  },

  async createPage(request, reply) {
    const user = await requireAdminUser(request, reply);
    if (!user) return;

    const payload = buildPagePayload(request.body);
    if (payload.error) {
      return reply.status(400).send({ error: payload.error });
    }

    const existing = await pageRepository.getPageBySlug(payload.data.Slug);
    if (existing) {
      return reply.status(400).send({ error: "Ce slug existe déjà." });
    }

    if (payload.data.ThemeID) {
      const theme = await pageRepository.getThemeById(payload.data.ThemeID);
      if (!theme) {
        return reply.status(400).send({ error: "Le thème sélectionné est introuvable." });
      }
    }

    const page = await pageRepository.createPage(payload.data);
    reply.send(page);
  },

  async updatePage(request, reply) {
    const user = await requireAdminUser(request, reply);
    if (!user) return;

    const pageId = Number(request.params.pageId);
    const currentPage = await pageRepository.getPageById(pageId);
    if (!currentPage) {
      return reply.status(404).send({ error: "Page introuvable." });
    }

    const payload = buildPagePayload(request.body);
    if (payload.error) {
      return reply.status(400).send({ error: payload.error });
    }

    const existing = await pageRepository.getPageBySlug(payload.data.Slug);
    if (existing && existing.PageID !== pageId) {
      return reply.status(400).send({ error: "Ce slug existe déjà." });
    }

    if (payload.data.ThemeID) {
      const theme = await pageRepository.getThemeById(payload.data.ThemeID);
      if (!theme) {
        return reply.status(400).send({ error: "Le thème sélectionné est introuvable." });
      }
    }

    const page = await pageRepository.updatePage(pageId, payload.data);
    reply.send(page);
  },

  async deletePage(request, reply) {
    const user = await requireAdminUser(request, reply);
    if (!user) return;

    if (user.GradeID !== 1) {
      return reply.status(403).send({ error: "Seul un super administrateur peut supprimer une page." });
    }

    const pageId = Number(request.params.pageId);
    const page = await pageRepository.getPageById(pageId);
    if (!page) {
      return reply.status(404).send({ error: "Page introuvable." });
    }

    await pageRepository.deletePage(pageId);
    await fs.promises.rm(getPageUploadDir(pageId), { recursive: true, force: true });
    reply.send({ message: "Page supprimée avec succès." });
  },

  async createSection(request, reply) {
    const user = await requireAdminUser(request, reply);
    if (!user) return;

    const pageId = Number(request.params.pageId);
    const page = await pageRepository.getPageById(pageId);
    if (!page) {
      return reply.status(404).send({ error: "Page introuvable." });
    }

    const { fields, imagePart } = await readMultipartSection(request);
    const payload = buildSectionPayload(fields, pageId);
    if (payload.error) {
      return reply.status(400).send({ error: payload.error });
    }

    if (payload.data.Type === "image" && !imagePart) {
      return reply.status(400).send({ error: "Une image est requise pour une section image." });
    }

    let section = await pageRepository.createSection(payload.data);
    if (payload.data.Type === "image" && imagePart) {
      const filePath = await saveSectionImage(pageId, section.SectionID, imagePart);
      section = await pageRepository.updateSection(section.SectionID, { CheminFichier: filePath });
    }

    reply.send(section);
  },

  async updateSection(request, reply) {
    const user = await requireAdminUser(request, reply);
    if (!user) return;

    const pageId = Number(request.params.pageId);
    const sectionId = Number(request.params.sectionId);
    const section = await pageRepository.getSectionById(sectionId);
    if (!section || section.PageID !== pageId) {
      return reply.status(404).send({ error: "Section introuvable." });
    }

    const { fields, imagePart } = await readMultipartSection(request);
    const payload = buildSectionPayload(fields, pageId);
    if (payload.error) {
      return reply.status(400).send({ error: payload.error });
    }

    let updateData = payload.data;
    delete updateData.PageID;

    if (payload.data.Type === "image" && !imagePart && !section.CheminFichier) {
      return reply.status(400).send({ error: "Une image est requise pour une section image." });
    }

    if (payload.data.Type === "image" && imagePart) {
      await deleteFileIfExists(section.CheminFichier);
      updateData.CheminFichier = await saveSectionImage(pageId, sectionId, imagePart);
    } else if (payload.data.Type !== "image") {
      await deleteFileIfExists(section.CheminFichier);
      updateData.CheminFichier = null;
      updateData.TexteAlt = null;
    }

    const updatedSection = await pageRepository.updateSection(sectionId, updateData);
    reply.send(updatedSection);
  },

  async deleteSection(request, reply) {
    const user = await requireAdminUser(request, reply);
    if (!user) return;

    const pageId = Number(request.params.pageId);
    const sectionId = Number(request.params.sectionId);
    const section = await pageRepository.getSectionById(sectionId);
    if (!section || section.PageID !== pageId) {
      return reply.status(404).send({ error: "Section introuvable." });
    }

    await deleteFileIfExists(section.CheminFichier);
    await pageRepository.deleteSection(sectionId);
    reply.send({ message: "Section supprimée avec succès." });
  },

  async listThemes(request, reply) {
    const user = await requireAdminUser(request, reply);
    if (!user) return;

    const themes = await pageRepository.listThemes();
    reply.send(themes);
  },

  async createTheme(request, reply) {
    const user = await requireAdminUser(request, reply);
    if (!user) return;

    const payload = buildThemePayload(request.body);
    if (payload.error) {
      return reply.status(400).send({ error: payload.error });
    }

    const existing = await pageRepository.getThemeBySlug(payload.data.Slug);
    if (existing) {
      return reply.status(400).send({ error: "Ce slug de thème existe déjà." });
    }

    const theme = await pageRepository.createTheme(payload.data);
    reply.send(theme);
  },

  async updateTheme(request, reply) {
    const user = await requireAdminUser(request, reply);
    if (!user) return;

    const themeId = Number(request.params.themeId);
    const currentTheme = await pageRepository.getThemeById(themeId);
    if (!currentTheme) {
      return reply.status(404).send({ error: "Thème introuvable." });
    }

    const payload = buildThemePayload(request.body);
    if (payload.error) {
      return reply.status(400).send({ error: payload.error });
    }

    const existing = await pageRepository.getThemeBySlug(payload.data.Slug);
    if (existing && existing.ThemeID !== themeId) {
      return reply.status(400).send({ error: "Ce slug de thème existe déjà." });
    }

    const theme = await pageRepository.updateTheme(themeId, payload.data);
    reply.send(theme);
  },

  async deleteTheme(request, reply) {
    const user = await requireAdminUser(request, reply);
    if (!user) return;

    if (user.GradeID !== 1) {
      return reply.status(403).send({ error: "Seul un super administrateur peut supprimer un thème." });
    }

    const themeId = Number(request.params.themeId);
    const theme = await pageRepository.getThemeById(themeId);
    if (!theme) {
      return reply.status(404).send({ error: "Thème introuvable." });
    }
    if (theme.Pages.length > 0) {
      return reply.status(400).send({ error: "Impossible de supprimer un thème qui contient encore des pages." });
    }

    await pageRepository.deleteTheme(themeId);
    reply.send({ message: "Thème supprimé avec succès." });
  },
};
