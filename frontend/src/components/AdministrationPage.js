import React, { useState } from "react";
import FormNewAdmin from "./FormNewAdmin";
import AdminList from "./AdminList";

const AdministrationPage = () => {
    const [reload, setReload] = useState(false);

    const handleStateChange = () => {
        setReload((prev) => !prev);
    };

    return (
        <main className="mx-auto max-w-7xl grow">
            <div className="space-y-6 text-neutral-100">
                <header>
                    <h1 className="text-2xl font-semibold text-slate-50">Administration</h1>
                    <p className="mt-1 text-sm text-slate-400">Gérez les administrateurs et les accès à DoCode.</p>
                </header>

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(320px,0.42fr)_minmax(0,1fr)]">
                    <FormNewAdmin onCreated={handleStateChange} />
                    <AdminList key={reload} onStateChange={handleStateChange} />
                </section>
            </div>
        </main>
    );
};

export default AdministrationPage;
