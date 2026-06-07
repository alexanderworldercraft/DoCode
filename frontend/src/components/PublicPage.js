import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ClipboardDocumentIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import api from "../services/api";

const apiBaseUrl = process.env.REACT_APP_URL_LOCAL;

function PublicSection({ section }) {
  const [isCopied, setIsCopied] = useState(false);
  const sectionAnchor = `section-${section.SectionID}`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(section.Contenu || "");
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1400);
    } catch (error) {
      console.error("Impossible de copier le code :", error);
    }
  };

  if (section.Type === "titre") {
    return (
      <section id={sectionAnchor} className="theme-border scroll-mt-28 border-b pb-5">
        <p className="theme-accent text-sm font-semibold uppercase tracking-[0.18em]">{section.Titre}</p>
        <h2 className="theme-text mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          {section.Contenu || section.Titre}
        </h2>
      </section>
    );
  }

  if (section.Type === "texte") {
    return (
      <section id={sectionAnchor} className="scroll-mt-28">
        {section.Titre && <h2 className="theme-text text-2xl font-bold">{section.Titre}</h2>}
        <p className="theme-muted mt-3 whitespace-pre-wrap text-base leading-8">{section.Contenu}</p>
      </section>
    );
  }

  if (section.Type === "code") {
    return (
      <section id={sectionAnchor} className="theme-surface-strong scroll-mt-28 overflow-hidden rounded-lg border shadow-lg shadow-sky-950/30">
        <div className="theme-border theme-accent-bg flex items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-sky-100">
            <CodeBracketIcon className="h-5 w-5 text-sky-300" />
            {section.Titre || "Bloc de code"}
          </div>
          <div className="flex items-center gap-2">
            <span className="theme-input rounded border px-2 py-1 text-xs font-semibold uppercase">
              {section.Langage || "text"}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="theme-input inline-flex items-center gap-1 rounded border px-2 py-1 text-xs font-semibold transition hover:border-sky-300"
              aria-label="Copier le code"
            >
              <ClipboardDocumentIcon className="h-4 w-4" />
              {isCopied ? "Copié" : ""}
            </button>
          </div>
        </div>
        <pre className="overflow-auto p-4 text-sm leading-7 text-sky-100">
          <code className={`language-${section.Langage || "text"}`}>{section.Contenu}</code>
        </pre>
      </section>
    );
  }

  if (section.Type === "image" && section.CheminFichier) {
    return (
      <figure id={sectionAnchor} className="scroll-mt-28">
        <img
          src={`${apiBaseUrl}${section.CheminFichier}`}
          alt={section.TexteAlt || section.Titre || ""}
          className="max-h-[34rem] w-full rounded-lg border border-white/10 object-contain"
        />
        {section.Titre && <figcaption className="theme-subtle mt-3 text-sm">{section.Titre}</figcaption>}
      </figure>
    );
  }

  return null;
}

export default function PublicPage() {
  const { slug } = useParams();
  const location = useLocation();
  const [page, setPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchPage = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const response = await api.get(`/pages/public/${slug}`);
        if (isMounted) setPage(response.data);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.response?.data?.error || "Page introuvable.");
          setPage(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPage();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (isLoading || !page || !location.hash) return;

    const element = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (element) {
      window.setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  }, [isLoading, page, location.hash]);

  if (isLoading) {
    return <main className="theme-muted mx-auto max-w-4xl">Chargement de la page...</main>;
  }

  if (errorMessage) {
    return (
      <main className="mx-auto max-w-4xl">
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-6 text-rose-100">
          <h1 className="text-xl font-bold">Page indisponible</h1>
          <p className="mt-2 text-sm">{errorMessage}</p>
          <Link to="/" className="mt-5 inline-flex rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400">
            Retour à l'accueil
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl">
      <article className="space-y-8">
        <header className="theme-border border-b pb-8">
          <p className="theme-accent text-sm font-semibold uppercase tracking-[0.22em]">Page publique</p>
          <h1 className="theme-text mt-4 text-4xl font-black tracking-tight sm:text-5xl">{page.Titre}</h1>
          {page.Description && <p className="theme-muted mt-4 max-w-2xl text-lg leading-8">{page.Description}</p>}
        </header>

        {page.Sections?.length === 0 && (
          <p className="theme-surface rounded-lg border p-5 text-sm">
            Cette page ne contient pas encore de section.
          </p>
        )}

        {page.Sections?.map((section) => (
          <PublicSection key={section.SectionID} section={section} />
        ))}
      </article>
    </main>
  );
}
