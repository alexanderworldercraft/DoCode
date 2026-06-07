import React from "react";
import UpdateSettings from "./UpdateSettings";
import DeleteAccount from "./DeleteAccount";

const SettingsPage = () => {
  return (
    <main className="mx-auto max-w-7xl grow">
      <div className="theme-text space-y-6">
        <header>
          <h1 className="theme-text text-2xl font-semibold">Paramètres</h1>
          <p className="theme-subtle mt-1 text-sm">Gérez votre profil, votre photo et la sécurité du compte.</p>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)]">
          <UpdateSettings />
          <DeleteAccount />
        </div>
      </div>
    </main>
  );
};

export default SettingsPage;
