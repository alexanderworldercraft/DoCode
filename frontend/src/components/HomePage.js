import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <main className="theme-text">
      <section className="mx-auto flex max-w-6xl flex-col justify-center py-12">
        <div className="max-w-3xl">
          <p className="theme-accent text-sm font-semibold uppercase tracking-[0.22em]">DoCode</p>
          <h1 className="theme-text mt-5 text-4xl font-black tracking-tight sm:text-6xl">
            Base applicative publique et administrable.
          </h1>
          <p className="theme-muted mt-6 max-w-2xl text-lg leading-8">
            DoCode démarre avec une couche publique accessible sans compte et une couche
            d'administration réservée aux administrateurs et super administrateurs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="rounded-md bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-400"
            >
              Accès administrateur
            </Link>
            <a
              href="#pages"
              className="theme-border theme-accent rounded-md border px-5 py-3 text-sm font-semibold hover:border-sky-300"
            >
              Voir les pages publiques
            </a>
          </div>
        </div>

        <div id="pages" className="theme-surface mt-16 rounded-lg border p-5">
          <h2 className="theme-text text-lg font-semibold">Pages publiques</h2>
          <p className="theme-subtle mt-2 text-sm leading-6">
            Les pages publiées apparaissent automatiquement dans la sidebar publique.
          </p>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
