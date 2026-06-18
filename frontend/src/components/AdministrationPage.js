import React, { useState } from "react";
import FormNewAdmin from "./FormNewAdmin";
import AdminList from "./AdminList";
import PublicPagesAdmin from "./PublicPagesAdmin";
import ManualBackup from "./ManualBackup";

const AdministrationPage = () => {
    const [reload, setReload] = useState(false);

    const handleStateChange = () => {
        setReload((prev) => !prev);
    };

    return (
        <main className="mx-auto max-w-7xl grow">
            <div className="theme-text space-y-6">
                <header>
                    <h1 className="theme-text text-2xl font-semibold">Administration</h1>
                    <p className="theme-subtle mt-1 text-sm">Gérez les administrateurs et les accès à DoCode.</p>
                </header>

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(320px,0.42fr)_minmax(0,1fr)]">
                    <FormNewAdmin onCreated={handleStateChange} />
                    <AdminList key={reload} onStateChange={handleStateChange} />
                </section>

                <ManualBackup />

                <PublicPagesAdmin />
            </div>
        </main>
    );
};

export default AdministrationPage;
