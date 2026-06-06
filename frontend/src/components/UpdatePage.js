import React from "react";

const updates = [
  {
    version: "0.1.0",
    title: "Initialisation DoCode",
    date: "6 juin 2026",
    sections: [
      {
        title: "Application",
        items: [
          "Création d'une base publique accessible sans connexion.",
          "Mise en place d'une couche administrateur protégée par authentification.",
          "Accès réservé aux comptes Admin et SuperAdmin.",
        ],
      },
      {
        title: "Administration",
        items: [
          "Création des administrateurs depuis la page Administration.",
          "Suppression de l'inscription publique afin de conserver uniquement des comptes administrateurs.",
          "Gestion de l'état des comptes administrateurs par le super administrateur.",
        ],
      },
      {
        title: "Base technique",
        items: [
          "Nettoyage de l'ancienne base métier pour repartir sur le socle DoCode.",
          "Réduction du schéma Prisma aux modèles nécessaires aux comptes, grades et états.",
          "Ajout d'un seed de base pour initialiser les grades, états et le super administrateur.",
        ],
      },
    ],
  },
];

const UpdatePage = () => {
  return (
    <main className="mx-auto max-w-5xl grow text-slate-100">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">Mises à jour</h1>
        <p className="mt-1 text-sm text-slate-400">Historique des changements importants de DoCode.</p>
      </header>

      <div className="mt-6 space-y-6">
        {updates.map((update) => (
          <article key={update.version} className="overflow-hidden rounded-lg border border-sky-500/20 bg-slate-950/70">
            <div className="border-b border-white/10 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Version {update.version}</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">{update.title}</h2>
                </div>
                <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-100">
                  {update.date}
                </span>
              </div>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-2">
              {update.sections.map((section) => (
                <section key={section.title} className="rounded-lg border border-white/10 bg-slate-900/50 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-100">{section.title}</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};

export default UpdatePage;
