import React from "react";

const updates = [
  {
    version: "0.2.2",
    title: "Accessibilité et thème clair",
    date: "7 juin 2026",
    sections: [
      {
        title: "Thèmes",
        items: [
          "Ajout d'un double thème pour conserver le thème sombre actuel et proposer un thème clair plus accessible.",
          "Ajout d'un bouton de bascule clair/sombre dans le header principal.",
          "Mémorisation du thème sélectionné dans le navigateur afin de conserver le choix utilisateur.",
        ],
      },
      {
        title: "Accessibilité",
        items: [
          "Ajout de libellés accessibles sur le bouton de changement de thème.",
          "Amélioration des contrastes en thème clair avec des couleurs de texte, bordures et surfaces dédiées.",
          "Adaptation de la page de connexion pour permettre le changement de thème avant authentification.",
        ],
      },
      {
        title: "Interface",
        items: [
          "Mise en place de variables CSS globales pour piloter les couleurs de fond, surfaces, textes, bordures et accents.",
          "Adaptation des pages Accueil, Pages publiques, Administration, Paramètres, Connexion, Footer et Mises à jour au nouveau système de thème.",
          "Conservation du style visuel DoCode avec les accents bleus et les surfaces sobres dans les deux thèmes.",
        ],
      },
      {
        title: "Base technique",
        items: [
          "Ajout d'un contexte React dédié au thème avec un hook réutilisable.",
          "Application du thème via l'attribut data-theme sur la racine HTML.",
          "Validation du build frontend après intégration du système de thème.",
        ],
      },
    ],
  },
  {
    version: "0.2.1",
    title: "Administration des pages dynamiques",
    date: "6 juin 2026",
    sections: [
      {
        title: "Navigation",
        items: [
          "Déplacement de la création des dropdowns et thèmes dans une section dédiée avant les pages dynamiques.",
          "Séparation visuelle de la gestion des thèmes et de la gestion des pages pour clarifier l'administration.",
        ],
      },
      {
        title: "Administration",
        items: [
          "Ajout du drag and drop sur les blocs de section déjà créés.",
          "Réordonnancement automatique des sections après déplacement d'un bloc.",
          "Mise à jour des ordres de toutes les sections concernées afin de conserver une incrémentation propre.",
        ],
      },
      {
        title: "Expérience",
        items: [
          "Ajout d'un indicateur visuel sur les blocs déplaçables.",
          "Affichage d'un retour de positionnement pendant le déplacement d'une section.",
          "Mise à jour immédiate de l'affichage après un déplacement réussi.",
        ],
      },
    ],
  },
  {
    version: "0.2.0",
    title: "Pages publiques dynamiques",
    date: "6 juin 2026",
    sections: [
      {
        title: "Contenu public",
        items: [
          "Ajout de pages publiques dynamiques accessibles via des URLs dédiées en /p/slug.",
          "Affichage des pages publiées dans la sidebar publique avec prise en charge des brouillons.",
          "Ajout d'une sidebar commune aux pages publiques et aux pages administrateur.",
        ],
      },
      {
        title: "Administration",
        items: [
          "Ajout d'un CRUD complet pour créer, modifier, publier, dépublier et supprimer les pages publiques.",
          "Ajout de sections de page administrables : titre, bloc de texte, bloc de code et image.",
          "Ajout d'un CRUD complet des sections avec suppression indépendante de chaque bloc.",
          "Restriction de la suppression des pages aux super administrateurs.",
        ],
      },
      {
        title: "Navigation",
        items: [
          "Ajout de dropdowns de sidebar pour classer les pages publiques par thème.",
          "Ajout d'un CRUD des thèmes par les administrateurs et super administrateurs.",
          "Restriction de la suppression des thèmes aux super administrateurs, uniquement quand aucune page n'y est rattachée.",
          "Déplacement du lien Mises à jour vers le bloc de version en bas de sidebar.",
        ],
      },
      {
        title: "Recherche",
        items: [
          "Ajout d'une barre de recherche dans le header principal.",
          "Recherche par nom de page et par titre de section avec prévisualisation des résultats.",
          "Navigation directe vers une section depuis les résultats de recherche avec défilement automatique.",
        ],
      },
      {
        title: "Expérience",
        items: [
          "Ajout d'un bouton minimaliste pour copier le contenu des blocs de code.",
          "Ajout d'un affichage stylisé des blocs de code avec langage visible.",
          "Redirection vers la page d'accueil après déconnexion.",
          "Suppression du doublon de lien de connexion dans la sidebar publique.",
        ],
      },
      {
        title: "Base technique",
        items: [
          "Ajout des modèles Prisma PublicPage, PageSection et PageTheme.",
          "Ajout des migrations de base pour les pages dynamiques, sections et thèmes.",
          "Stockage local des images de page dans backend/uploads/pages/PageID/SectionID.extension.",
        ],
      },
    ],
  },
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
    <main className="theme-text mx-auto max-w-5xl grow">
      <header>
        <h1 className="theme-text text-2xl font-semibold">Mises à jour</h1>
        <p className="theme-subtle mt-1 text-sm">Historique des changements importants de DoCode.</p>
      </header>

      <div className="mt-6 space-y-6">
        {updates.map((update) => (
          <article key={update.version} className="theme-surface overflow-hidden rounded-lg border">
            <div className="theme-border border-b p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="theme-accent text-xs font-semibold uppercase tracking-[0.18em]">Version {update.version}</p>
                  <h2 className="theme-text mt-2 text-xl font-semibold">{update.title}</h2>
                </div>
                <span className="theme-border theme-accent theme-accent-bg rounded-full border px-3 py-1 text-xs font-semibold">
                  {update.date}
                </span>
              </div>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-2">
              {update.sections.map((section) => (
                <section key={section.title} className="theme-surface-strong rounded-lg border p-4">
                  <h3 className="theme-text text-sm font-semibold uppercase tracking-[0.14em]">{section.title}</h3>
                  <ul className="theme-muted mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
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
