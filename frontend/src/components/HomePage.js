import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">DoCode</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl">
            Base applicative publique et administrable.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
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
              className="rounded-md border border-sky-500/30 px-5 py-3 text-sm font-semibold text-sky-100 hover:border-sky-300"
            >
              Voir les pages publiques
            </a>
          </div>
        </div>

        <div id="pages" className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            ["Présentation", "Une page publique prête à recevoir le contenu principal de DoCode."],
            ["Services", "Un espace pour décrire les fonctionnalités visibles sans connexion."],
            ["Contact", "Une base simple pour ajouter les informations de contact ou demandes entrantes."],
          ].map(([title, description]) => (
            <article key={title} className="rounded-lg border border-sky-500/20 bg-slate-900/70 p-5">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
