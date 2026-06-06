import { prisma } from "../services/db.js";

const pageInclude = {
  Theme: true,
  Sections: {
    orderBy: [{ Ordre: "asc" }, { SectionID: "asc" }],
  },
};

export const pageRepository = {
  async listAdminPages() {
    return prisma.publicPage.findMany({
      orderBy: [{ Ordre: "asc" }, { CreateDate: "desc" }],
      include: pageInclude,
    });
  },

  async listPublicLinks() {
    const themes = await prisma.pageTheme.findMany({
      orderBy: [{ Ordre: "asc" }, { Nom: "asc" }],
      include: {
        Pages: {
          where: { EstPubliee: true },
          orderBy: [{ Ordre: "asc" }, { Titre: "asc" }],
          select: {
            PageID: true,
            Titre: true,
            Slug: true,
            Description: true,
            Ordre: true,
          },
        },
      },
    });
    const ungroupedPages = await prisma.publicPage.findMany({
      where: { EstPubliee: true, ThemeID: null },
      orderBy: [{ Ordre: "asc" }, { Titre: "asc" }],
      select: {
        PageID: true,
        Titre: true,
        Slug: true,
        Description: true,
        Ordre: true,
      },
    });

    return {
      themes: themes
        .filter((theme) => theme.Pages.length > 0)
        .map((theme) => ({
          ThemeID: theme.ThemeID,
          Nom: theme.Nom,
          Slug: theme.Slug,
          Ordre: theme.Ordre,
          Pages: theme.Pages,
        })),
      ungroupedPages,
    };
  },

  async getPageById(pageId) {
    return prisma.publicPage.findUnique({
      where: { PageID: pageId },
      include: pageInclude,
    });
  },

  async getPublicPageBySlug(slug) {
    return prisma.publicPage.findFirst({
      where: { Slug: slug, EstPubliee: true },
      include: pageInclude,
    });
  },

  async getPageBySlug(slug) {
    return prisma.publicPage.findUnique({
      where: { Slug: slug },
    });
  },

  async createPage(data) {
    return prisma.publicPage.create({
      data: {
        ...data,
        CreateDate: new Date(),
      },
      include: pageInclude,
    });
  },

  async updatePage(pageId, data) {
    return prisma.publicPage.update({
      where: { PageID: pageId },
      data: {
        ...data,
        UpdateDate: new Date(),
      },
      include: pageInclude,
    });
  },

  async deletePage(pageId) {
    return prisma.publicPage.delete({
      where: { PageID: pageId },
    });
  },

  async getSectionById(sectionId) {
    return prisma.pageSection.findUnique({
      where: { SectionID: sectionId },
    });
  },

  async createSection(data) {
    return prisma.pageSection.create({
      data: {
        ...data,
        CreateDate: new Date(),
      },
    });
  },

  async updateSection(sectionId, data) {
    return prisma.pageSection.update({
      where: { SectionID: sectionId },
      data: {
        ...data,
        UpdateDate: new Date(),
      },
    });
  },

  async deleteSection(sectionId) {
    return prisma.pageSection.delete({
      where: { SectionID: sectionId },
    });
  },

  async listThemes() {
    return prisma.pageTheme.findMany({
      orderBy: [{ Ordre: "asc" }, { Nom: "asc" }],
      include: {
        Pages: {
          select: {
            PageID: true,
            Titre: true,
            Slug: true,
          },
          orderBy: [{ Ordre: "asc" }, { Titre: "asc" }],
        },
      },
    });
  },

  async getThemeById(themeId) {
    return prisma.pageTheme.findUnique({
      where: { ThemeID: themeId },
      include: {
        Pages: {
          select: { PageID: true },
        },
      },
    });
  },

  async getThemeBySlug(slug) {
    return prisma.pageTheme.findUnique({
      where: { Slug: slug },
    });
  },

  async createTheme(data) {
    return prisma.pageTheme.create({
      data: {
        ...data,
        CreateDate: new Date(),
      },
      include: {
        Pages: true,
      },
    });
  },

  async updateTheme(themeId, data) {
    return prisma.pageTheme.update({
      where: { ThemeID: themeId },
      data: {
        ...data,
        UpdateDate: new Date(),
      },
      include: {
        Pages: true,
      },
    });
  },

  async deleteTheme(themeId) {
    return prisma.pageTheme.delete({
      where: { ThemeID: themeId },
    });
  },

  async searchPublicPages(query) {
    return prisma.publicPage.findMany({
      where: {
        EstPubliee: true,
        OR: [
          { Titre: { contains: query } },
          {
            Sections: {
              some: {
                Titre: { contains: query },
              },
            },
          },
        ],
      },
      orderBy: [{ Ordre: "asc" }, { Titre: "asc" }],
      select: {
        PageID: true,
        Titre: true,
        Slug: true,
        Description: true,
        Sections: {
          where: {
            Titre: { contains: query },
          },
          orderBy: [{ Ordre: "asc" }, { SectionID: "asc" }],
          select: {
            SectionID: true,
            Type: true,
            Titre: true,
            Langage: true,
          },
        },
      },
      take: 8,
    });
  },
};
