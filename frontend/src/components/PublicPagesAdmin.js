import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ClipboardDocumentIcon,
  CodeBracketIcon,
  DocumentPlusIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  ArrowsUpDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import api from "../services/api";

const inputClassName = "mt-1 block min-h-10 w-full rounded-md border-0 bg-slate-900/80 px-3 py-2 text-slate-100 shadow-sm ring-1 ring-inset ring-slate-700 outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm";
const labelClassName = "block text-xs font-semibold uppercase text-slate-400";
const sectionTypes = [
  { value: "titre", label: "Titre" },
  { value: "texte", label: "Bloc de texte" },
  { value: "liste", label: "Liste" },
  { value: "code", label: "Bloc de code" },
  { value: "image", label: "Image" },
];

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function emptyPageForm() {
  return {
    themeId: "",
    titre: "",
    slug: "",
    description: "",
    ordre: 0,
    estPubliee: false,
  };
}

function emptyThemeForm() {
  return {
    themeId: null,
    nom: "",
    slug: "",
    ordre: 0,
  };
}

function emptySectionForm(nextOrder = 0) {
  return {
    sectionId: null,
    type: "texte",
    titre: "",
    contenu: "",
    langage: "javascript",
    texteAlt: "",
    ordre: nextOrder,
    image: null,
  };
}

function getOrderedSections(sections = []) {
  return [...sections].sort((firstSection, secondSection) => {
    if ((firstSection.Ordre || 0) !== (secondSection.Ordre || 0)) {
      return (firstSection.Ordre || 0) - (secondSection.Ordre || 0);
    }
    return firstSection.SectionID - secondSection.SectionID;
  });
}

function getListItems(content) {
  return String(content || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isOrderedList(section) {
  return section?.Type === "liste" && section?.Langage === "ordered";
}

function buildSectionFormData(section, ordre) {
  const formData = new FormData();
  formData.append("type", section.Type);
  formData.append("titre", section.Titre || "");
  formData.append("contenu", section.Contenu || "");
  formData.append("langage", section.Langage || "javascript");
  formData.append("texteAlt", section.TexteAlt || "");
  formData.append("ordre", ordre);
  return formData;
}

function SectionForm({ page, onSaved, onCancel, editingSection }) {
  const [form, setForm] = useState(() => emptySectionForm(page?.Sections?.length || 0));
  const [errorMessage, setErrorMessage] = useState("");
  const isEditing = Boolean(editingSection);

  useEffect(() => {
    if (!editingSection) {
      setForm(emptySectionForm(page?.Sections?.length || 0));
      return;
    }

    setForm({
      sectionId: editingSection.SectionID,
      type: editingSection.Type,
      titre: editingSection.Titre || "",
      contenu: editingSection.Contenu || "",
      langage: editingSection.Langage || "javascript",
      texteAlt: editingSection.TexteAlt || "",
      ordre: editingSection.Ordre || 0,
      image: null,
    });
  }, [editingSection, page]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = (value) => {
    setForm((prev) => ({
      ...prev,
      type: value,
      langage: value === "liste"
        ? prev.langage === "ordered" ? "ordered" : "unordered"
        : value === "code" && (prev.type === "liste" || !prev.langage)
          ? "javascript"
          : prev.langage,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (form.type === "image" && !isEditing && !form.image) {
      setErrorMessage("Ajoutez une image pour créer une section image.");
      return;
    }

    const formData = new FormData();
    formData.append("type", form.type);
    formData.append("titre", form.titre);
    formData.append("contenu", form.contenu);
    formData.append("langage", form.langage);
    formData.append("texteAlt", form.texteAlt);
    formData.append("ordre", form.ordre);
    if (form.image) formData.append("image", form.image);

    try {
      if (isEditing) {
        await api.put(`/pages/${page.PageID}/sections/${form.sectionId}`, formData);
      } else {
        await api.post(`/pages/${page.PageID}/sections`, formData);
      }
      setForm(emptySectionForm((page?.Sections?.length || 0) + 1));
      onSaved();
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Impossible d'enregistrer la section.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-sky-500/20 bg-slate-950/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase text-sky-300">
          {isEditing ? "Modifier la section" : "Ajouter une section"}
        </h3>
        {isEditing && (
          <button type="button" onClick={onCancel} className="text-xs font-semibold text-slate-400 hover:text-white">
            Annuler
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_120px]">
        <div>
          <label className={labelClassName}>Type</label>
          <select className={inputClassName} value={form.type} onChange={(event) => handleTypeChange(event.target.value)}>
            {sectionTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClassName}>Ordre</label>
          <input type="number" className={inputClassName} value={form.ordre} onChange={(event) => handleChange("ordre", event.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClassName}>Titre interne ou affiché</label>
        <input className={inputClassName} value={form.titre} onChange={(event) => handleChange("titre", event.target.value)} />
      </div>

      {form.type === "code" && (
        <div>
          <label className={labelClassName}>Langage</label>
          <input className={inputClassName} value={form.langage} onChange={(event) => handleChange("langage", event.target.value)} placeholder="javascript, html, css..." />
        </div>
      )}

      {form.type === "liste" && (
        <div>
          <label className={labelClassName}>Type de liste</label>
          <select className={inputClassName} value={form.langage === "ordered" ? "ordered" : "unordered"} onChange={(event) => handleChange("langage", event.target.value)}>
            <option value="unordered">Désordonnée</option>
            <option value="ordered">Ordonnée</option>
          </select>
        </div>
      )}

      {form.type !== "image" && (
        <div>
          <label className={labelClassName}>
            {form.type === "code" ? "Code" : form.type === "liste" ? "Éléments de liste (un par ligne)" : "Contenu"}
          </label>
          <textarea
            className={`${inputClassName} min-h-32 font-mono ${form.type === "code" ? "text-sky-100" : "font-sans"}`}
            value={form.contenu}
            onChange={(event) => handleChange("contenu", event.target.value)}
          />
        </div>
      )}

      {form.type === "image" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClassName}>Image</label>
            <input
              type="file"
              accept="image/*"
              className={`${inputClassName} file:mr-3 file:rounded file:border-0 file:bg-sky-500 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white`}
              onChange={(event) => handleChange("image", event.target.files?.[0] || null)}
            />
          </div>
          <div>
            <label className={labelClassName}>Texte alternatif</label>
            <input className={inputClassName} value={form.texteAlt} onChange={(event) => handleChange("texteAlt", event.target.value)} />
          </div>
        </div>
      )}

      <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400">
        <PlusIcon className="h-4 w-4" />
        {isEditing ? "Enregistrer la section" : "Ajouter la section"}
      </button>
    </form>
  );
}

function SectionPreview({
  section,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
  dropPosition,
}) {
  const apiBaseUrl = process.env.REACT_APP_URL_LOCAL;
  const [isCopied, setIsCopied] = useState(false);
  const ListTag = isOrderedList(section) ? "ol" : "ul";

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(section.Contenu || "");
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1400);
    } catch (error) {
      console.error("Impossible de copier le code :", error);
    }
  };

  return (
    <article
      draggable
      onDragStart={(event) => onDragStart(event, section)}
      onDragOver={(event) => onDragOver(event, section)}
      onDrop={(event) => onDrop(event, section)}
      onDragEnd={onDragEnd}
      className={`rounded-lg border bg-slate-950/60 p-4 transition ${
        isDragging ? "border-sky-300/80 opacity-60" : "border-sky-500/20"
      } ${
        dropPosition === "before"
          ? "ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-950"
          : dropPosition === "after"
            ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950"
            : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex cursor-grab items-center gap-1 rounded border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-xs font-semibold uppercase text-sky-200 active:cursor-grabbing">
              <ArrowsUpDownIcon className="h-4 w-4" />
              {section.Type} · ordre {section.Ordre}
            </span>
            <span className="text-xs text-slate-500">Glisser pour déplacer</span>
          </div>
          {section.Titre && <h4 className="mt-3 text-lg font-semibold text-white">{section.Titre}</h4>}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => onEdit(section)} className="rounded-md border border-sky-500/30 px-3 py-1.5 text-xs font-semibold text-sky-100 hover:border-sky-300">
            Modifier
          </button>
          <button type="button" onClick={() => onDelete(section)} className="rounded-md border border-rose-500/30 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:border-rose-300">
            Supprimer
          </button>
        </div>
      </div>
      {section.Type === "texte" && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">{section.Contenu}</p>}
      {section.Type === "liste" && (
        <ListTag className={`mt-3 space-y-2 pl-5 text-sm leading-6 text-slate-300 ${isOrderedList(section) ? "list-decimal" : "list-disc"}`}>
          {getListItems(section.Contenu).map((item, index) => (
            <li key={`${section.SectionID}-item-${index}`}>{item}</li>
          ))}
        </ListTag>
      )}
      {section.Type === "titre" && <p className="mt-3 text-2xl font-black text-white">{section.Contenu || section.Titre}</p>}
      {section.Type === "code" && (
        <div className="mt-3 overflow-hidden rounded-lg border border-sky-500/30 bg-slate-950 shadow-inner shadow-sky-950/50">
          <div className="flex items-center justify-between gap-3 border-b border-sky-500/20 bg-sky-500/10 px-4 py-2">
            <span className="text-xs font-semibold uppercase text-sky-200">{section.Langage || "text"}</span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1 rounded border border-sky-500/30 bg-slate-950/70 px-2 py-1 text-xs font-semibold text-sky-100 transition hover:border-sky-300 hover:text-white"
              aria-label="Copier le code"
            >
              <ClipboardDocumentIcon className="h-4 w-4" />
              {isCopied ? "Copié" : ""}
            </button>
          </div>
          <pre className="overflow-auto p-4 text-sm leading-6 text-sky-100">
            <code className={`language-${section.Langage || "text"}`}>{section.Contenu}</code>
          </pre>
        </div>
      )}
      {section.Type === "image" && section.CheminFichier && (
        <img src={`${apiBaseUrl}${section.CheminFichier}`} alt={section.TexteAlt || section.Titre || ""} className="mt-3 max-h-72 rounded-lg border border-white/10 object-contain" />
      )}
    </article>
  );
}

export default function PublicPagesAdmin() {
  const [pages, setPages] = useState([]);
  const [themes, setThemes] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [pageForm, setPageForm] = useState(emptyPageForm());
  const [themeForm, setThemeForm] = useState(emptyThemeForm());
  const [editingSection, setEditingSection] = useState(null);
  const [currentUserGrade, setCurrentUserGrade] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [draggedSectionId, setDraggedSectionId] = useState(null);
  const [dropTarget, setDropTarget] = useState({ sectionId: null, position: null });
  const sectionFormRef = useRef(null);

  const selectedPage = useMemo(
    () => pages.find((page) => page.PageID === selectedPageId) || null,
    [pages, selectedPageId]
  );
  const orderedSelectedSections = useMemo(
    () => getOrderedSections(selectedPage?.Sections || []),
    [selectedPage]
  );

  const fetchPages = async (nextSelectedId) => {
    const response = await api.get("/pages");
    setPages(response.data);
    if (typeof nextSelectedId !== "undefined") {
      setSelectedPageId(nextSelectedId);
    }
  };

  const fetchThemes = async () => {
    const response = await api.get("/pages/themes");
    setThemes(response.data);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const [pagesResponse, themesResponse] = await Promise.all([
        api.get("/pages"),
        api.get("/pages/themes"),
      ]);
      setPages(pagesResponse.data);
      setThemes(themesResponse.data);
      if (pagesResponse.data[0]) {
        setSelectedPageId(pagesResponse.data[0].PageID);
      }
    };

    loadInitialData();
    api.get("/users/me").then((response) => setCurrentUserGrade(response.data.GradeID)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedPage) {
      setPageForm(emptyPageForm());
      return;
    }

    setPageForm({
      themeId: selectedPage.ThemeID || "",
      titre: selectedPage.Titre || "",
      slug: selectedPage.Slug || "",
      description: selectedPage.Description || "",
      ordre: selectedPage.Ordre || 0,
      estPubliee: Boolean(selectedPage.EstPubliee),
    });
    setEditingSection(null);
  }, [selectedPage]);

  const handlePageField = (field, value) => {
    setPageForm((prev) => ({
      ...prev,
      [field]: value,
      slug: field === "titre" && !selectedPage ? slugify(value) : prev.slug,
    }));
  };

  const handleThemeField = (field, value) => {
    setThemeForm((prev) => ({
      ...prev,
      [field]: value,
      slug: field === "nom" && !prev.themeId ? slugify(value) : prev.slug,
    }));
  };

  const handleNewPage = () => {
    setSelectedPageId(null);
    setPageForm(emptyPageForm());
    setEditingSection(null);
  };

  const handleSavePage = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      themeId: pageForm.themeId ? Number(pageForm.themeId) : null,
      titre: pageForm.titre,
      slug: pageForm.slug || slugify(pageForm.titre),
      description: pageForm.description,
      ordre: Number(pageForm.ordre || 0),
      estPubliee: Boolean(pageForm.estPubliee),
    };

    try {
      if (selectedPage) {
        const response = await api.put(`/pages/${selectedPage.PageID}`, payload);
        await fetchPages(response.data.PageID);
        await fetchThemes();
        setSuccessMessage("Page mise à jour.");
      } else {
        const response = await api.post("/pages", payload);
        await fetchPages(response.data.PageID);
        await fetchThemes();
        setSuccessMessage("Page créée.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Impossible d'enregistrer la page.");
    }
  };

  const handleSaveTheme = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      nom: themeForm.nom,
      slug: themeForm.slug || slugify(themeForm.nom),
      ordre: Number(themeForm.ordre || 0),
    };

    try {
      if (themeForm.themeId) {
        await api.put(`/pages/themes/${themeForm.themeId}`, payload);
        setSuccessMessage("Thème mis à jour.");
      } else {
        await api.post("/pages/themes", payload);
        setSuccessMessage("Thème créé.");
      }
      setThemeForm(emptyThemeForm());
      await fetchThemes();
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Impossible d'enregistrer le thème.");
    }
  };

  const handleEditTheme = (theme) => {
    setThemeForm({
      themeId: theme.ThemeID,
      nom: theme.Nom || "",
      slug: theme.Slug || "",
      ordre: theme.Ordre || 0,
    });
  };

  const handleDeleteTheme = async (theme) => {
    const confirmed = window.confirm(`Supprimer le thème "${theme.Nom}" ?`);
    if (!confirmed) return;

    try {
      await api.delete(`/pages/themes/${theme.ThemeID}`);
      setThemeForm(emptyThemeForm());
      await fetchThemes();
      setSuccessMessage("Thème supprimé.");
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Impossible de supprimer le thème.");
    }
  };

  const handleDeletePage = async () => {
    if (!selectedPage) return;
    const confirmed = window.confirm(`Supprimer la page "${selectedPage.Titre}" et tous ses contenus ?`);
    if (!confirmed) return;

    try {
      await api.delete(`/pages/${selectedPage.PageID}`);
      setSelectedPageId(null);
      await fetchPages();
      await fetchThemes();
      setSuccessMessage("Page supprimée.");
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Impossible de supprimer la page.");
    }
  };

  const handleDeleteSection = async (section) => {
    const confirmed = window.confirm("Supprimer cette section ?");
    if (!confirmed) return;

    await api.delete(`/pages/${selectedPage.PageID}/sections/${section.SectionID}`);
    await fetchPages(selectedPage.PageID);
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    window.setTimeout(() => {
      sectionFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const handleSectionDragStart = (event, section) => {
    setDraggedSectionId(section.SectionID);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(section.SectionID));
  };

  const handleSectionDragOver = (event, section) => {
    if (!draggedSectionId || draggedSectionId === section.SectionID) return;
    event.preventDefault();

    const bounds = event.currentTarget.getBoundingClientRect();
    const position = event.clientY < bounds.top + bounds.height / 2 ? "before" : "after";
    setDropTarget({ sectionId: section.SectionID, position });
  };

  const handleSectionDragEnd = () => {
    setDraggedSectionId(null);
    setDropTarget({ sectionId: null, position: null });
  };

  const handleSectionDrop = async (event, targetSection) => {
    event.preventDefault();

    const sourceSectionId = draggedSectionId || Number(event.dataTransfer.getData("text/plain"));
    const position = dropTarget.sectionId === targetSection.SectionID ? dropTarget.position : "before";
    handleSectionDragEnd();

    if (!selectedPage || !sourceSectionId || sourceSectionId === targetSection.SectionID) return;

    const currentSections = getOrderedSections(selectedPage.Sections || []);
    const draggedSection = currentSections.find((section) => section.SectionID === sourceSectionId);
    if (!draggedSection) return;

    const remainingSections = currentSections.filter((section) => section.SectionID !== sourceSectionId);
    const targetIndex = remainingSections.findIndex((section) => section.SectionID === targetSection.SectionID);
    if (targetIndex === -1) return;

    const nextSections = [...remainingSections];
    nextSections.splice(position === "after" ? targetIndex + 1 : targetIndex, 0, draggedSection);
    const reorderedSections = nextSections.map((section, index) => ({ ...section, Ordre: index + 1 }));

    setPages((prevPages) =>
      prevPages.map((page) =>
        page.PageID === selectedPage.PageID ? { ...page, Sections: reorderedSections } : page
      )
    );
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await Promise.all(
        reorderedSections.map((section) =>
          api.put(
            `/pages/${selectedPage.PageID}/sections/${section.SectionID}`,
            buildSectionFormData(section, section.Ordre)
          )
        )
      );
      await fetchPages(selectedPage.PageID);
      setSuccessMessage("Ordre des sections mis à jour.");
    } catch (error) {
      await fetchPages(selectedPage.PageID);
      setErrorMessage(error.response?.data?.error || "Impossible de réordonner les sections.");
    }
  };

  return (
    <>
    <section className="mb-6 overflow-hidden rounded-lg border border-sky-500/30 bg-[linear-gradient(135deg,rgba(2,6,23,0.98),rgba(15,23,42,0.9))] shadow-[0_24px_80px_rgba(2,6,23,0.38)]">
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase text-sky-300">Navigation publique</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-50">Dropdowns / thèmes</h2>
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase text-sky-300">{themeForm.themeId ? "Modifier le thème" : "Créer un thème"}</h3>
          {themeForm.themeId && (
            <button type="button" onClick={() => setThemeForm(emptyThemeForm())} className="text-xs font-semibold text-slate-400 hover:text-white">
              Nouveau thème
            </button>
          )}
        </div>

        <form onSubmit={handleSaveTheme} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_100px_auto]">
          <div>
            <label className={labelClassName}>Nom</label>
            <input className={inputClassName} value={themeForm.nom} onChange={(event) => handleThemeField("nom", event.target.value)} required />
          </div>
          <div>
            <label className={labelClassName}>Slug</label>
            <input className={inputClassName} value={themeForm.slug} onChange={(event) => handleThemeField("slug", slugify(event.target.value))} required />
          </div>
          <div>
            <label className={labelClassName}>Ordre</label>
            <input type="number" className={inputClassName} value={themeForm.ordre} onChange={(event) => handleThemeField("ordre", event.target.value)} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="h-10 rounded-md bg-sky-500 px-4 text-sm font-semibold text-white hover:bg-sky-400">
              {themeForm.themeId ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>

        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {themes.length === 0 && <p className="text-sm text-slate-400">Aucun thème créé.</p>}
          {themes.map((theme) => (
            <div key={theme.ThemeID} className="rounded-md border border-sky-500/20 bg-slate-900/60 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{theme.Nom}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    /{theme.Slug} · {theme.Pages?.length || 0} page{theme.Pages?.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => handleEditTheme(theme)} className="rounded border border-sky-500/30 px-2 py-1 text-xs font-semibold text-sky-100 hover:border-sky-300">
                    Modifier
                  </button>
                  {currentUserGrade === 1 && (theme.Pages?.length || 0) === 0 && (
                    <button type="button" onClick={() => handleDeleteTheme(theme)} className="rounded border border-rose-500/30 px-2 py-1 text-xs font-semibold text-rose-200 hover:border-rose-300">
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {(errorMessage || successMessage) && (
      <div className={`mb-6 rounded-md border px-4 py-3 text-sm ${errorMessage ? "border-rose-500/30 bg-rose-500/10 text-rose-200" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"}`}>
        {errorMessage || successMessage}
      </div>
    )}

    <section className="overflow-hidden rounded-lg border border-sky-500/30 bg-[linear-gradient(135deg,rgba(2,6,23,0.98),rgba(15,23,42,0.9))] shadow-[0_24px_80px_rgba(2,6,23,0.38)]">
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky-500/15 text-sky-300">
              <DocumentPlusIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase text-sky-300">Contenu public</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-50">Pages dynamiques</h2>
            </div>
          </div>
          <button type="button" onClick={handleNewPage} className="inline-flex items-center gap-2 rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400">
            <PlusIcon className="h-4 w-4" />
            Nouvelle page
          </button>
        </div>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[280px_minmax(0,1fr)] sm:p-6">
        <aside className="space-y-2">
          {pages.length === 0 && <p className="text-sm text-slate-400">Aucune page créée.</p>}
          {pages.map((page) => (
            <button
              key={page.PageID}
              type="button"
              onClick={() => setSelectedPageId(page.PageID)}
              className={`block w-full rounded-lg border px-4 py-3 text-left text-sm transition ${
                selectedPageId === page.PageID
                  ? "border-sky-400/50 bg-sky-500/15 text-white"
                  : "border-sky-500/15 bg-slate-950/50 text-slate-300 hover:border-sky-400/35"
              }`}
            >
              <span className="block truncate font-semibold">{page.Titre}</span>
              <span className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                {page.EstPubliee ? <EyeIcon className="h-4 w-4 text-emerald-300" /> : <EyeSlashIcon className="h-4 w-4 text-amber-300" />}
                /p/{page.Slug}
              </span>
            </button>
          ))}
        </aside>

        <div className="space-y-5">
          <form onSubmit={handleSavePage} className="space-y-4 rounded-lg border border-sky-500/20 bg-slate-950/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-sm font-semibold uppercase text-sky-300">{selectedPage ? "Modifier la page" : "Créer une page"}</h3>
              <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-200">
                <span>{pageForm.estPubliee ? "Publiée" : "Brouillon"}</span>
                <input type="checkbox" className="h-5 w-5 rounded border-slate-600 bg-slate-900 text-sky-500" checked={pageForm.estPubliee} onChange={(event) => handlePageField("estPubliee", event.target.checked)} />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClassName}>Titre</label>
                <input className={inputClassName} value={pageForm.titre} onChange={(event) => handlePageField("titre", event.target.value)} required />
              </div>
              <div>
                <label className={labelClassName}>Slug</label>
                <input className={inputClassName} value={pageForm.slug} onChange={(event) => handlePageField("slug", slugify(event.target.value))} required />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(180px,0.35fr)_120px]">
              <div>
                <label className={labelClassName}>Description</label>
                <input className={inputClassName} value={pageForm.description} onChange={(event) => handlePageField("description", event.target.value)} />
              </div>
              <div>
                <label className={labelClassName}>Dropdown / thème</label>
                <select className={inputClassName} value={pageForm.themeId} onChange={(event) => handlePageField("themeId", event.target.value)}>
                  <option value="">Sans thème</option>
                  {themes.map((theme) => (
                    <option key={theme.ThemeID} value={theme.ThemeID}>{theme.Nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClassName}>Ordre</label>
                <input type="number" className={inputClassName} value={pageForm.ordre} onChange={(event) => handlePageField("ordre", event.target.value)} />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="submit" className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400">
                {selectedPage ? "Enregistrer la page" : "Créer la page"}
              </button>
              {selectedPage && currentUserGrade === 1 && (
                <button type="button" onClick={handleDeletePage} className="inline-flex items-center gap-2 rounded-md border border-rose-500/40 px-4 py-2 text-sm font-semibold text-rose-200 hover:border-rose-300">
                  <TrashIcon className="h-4 w-4" />
                  Supprimer la page
                </button>
              )}
            </div>
          </form>

          {selectedPage && (
            <>
              <div ref={sectionFormRef} className="scroll-mt-28">
                <SectionForm page={selectedPage} editingSection={editingSection} onCancel={() => setEditingSection(null)} onSaved={() => fetchPages(selectedPage.PageID)} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase text-slate-400">
                  <CodeBracketIcon className="h-4 w-4 text-sky-300" />
                  Sections
                </div>
                {orderedSelectedSections.length === 0 && (
                  <p className="rounded-lg border border-sky-500/20 bg-slate-950/60 p-4 text-sm text-slate-400">
                    Cette page n'a pas encore de section.
                  </p>
                )}
                {orderedSelectedSections.map((section) => (
                  <SectionPreview
                    key={section.SectionID}
                    section={section}
                    onEdit={handleEditSection}
                    onDelete={handleDeleteSection}
                    onDragStart={handleSectionDragStart}
                    onDragOver={handleSectionDragOver}
                    onDrop={handleSectionDrop}
                    onDragEnd={handleSectionDragEnd}
                    isDragging={draggedSectionId === section.SectionID}
                    dropPosition={dropTarget.sectionId === section.SectionID ? dropTarget.position : null}
                  />
                ))}
              </div>
            </>
          )}

          {!selectedPage && pages.length > 0 && (
            <div className="rounded-lg border border-sky-500/20 bg-slate-950/60 p-4 text-sm text-slate-400">
              Sélectionnez une page ou créez-en une nouvelle.
            </div>
          )}
        </div>
      </div>
    </section>
    </>
  );
}
