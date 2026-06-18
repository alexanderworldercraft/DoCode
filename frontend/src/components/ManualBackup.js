import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowDownTrayIcon,
  CircleStackIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const apiBaseUrl = process.env.REACT_APP_URL_LOCAL;

const inputClassName = "mt-1 block min-h-10 w-full rounded-md border-0 bg-slate-900/80 px-3 py-2 text-slate-100 shadow-sm ring-1 ring-inset ring-slate-700 outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm";
const labelClassName = "block text-xs font-semibold uppercase text-slate-400";

function getFileNameFromDisposition(disposition) {
  const match = disposition?.match(/filename="?([^"]+)"?/i);
  return match?.[1] || "sauvegarde.sql";
}

const ManualBackup = () => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [nomDeLaSave, setNomDeLaSave] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/users/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setIsSuperAdmin(response.data.GradeID === 1);
      } catch (error) {
        console.error("Erreur lors de la vérification superadmin:", error.response?.data || error.message);
      } finally {
        setIsLoadingUser(false);
      }
    };

    checkSuperAdmin();
  }, []);

  const handleBackup = async (event) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");
    setIsSaving(true);

    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/users/manual-backup`,
        { nomDeLaSave, motDePasse },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          responseType: "blob",
        }
      );

      const fileName = getFileNameFromDisposition(response.headers["content-disposition"]);
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setMessage(`Sauvegarde créée et téléchargée : ${fileName}`);
      setMotDePasse("");
      setNomDeLaSave("");
    } catch (error) {
      if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        try {
          const parsedError = JSON.parse(text);
          setErrorMessage(parsedError.error || "Erreur lors de la sauvegarde.");
        } catch {
          setErrorMessage("Erreur lors de la sauvegarde.");
        }
        return;
      }

      setErrorMessage(error.response?.data?.error || "Erreur lors de la sauvegarde.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-lg border border-sky-500/30 bg-[linear-gradient(135deg,rgba(2,6,23,0.98),rgba(15,23,42,0.9))] shadow-[0_24px_80px_rgba(2,6,23,0.38)]">
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky-500/15 text-sky-300">
            <CircleStackIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase text-sky-300">Base de données</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-50">Sauvegarde manuelle</h2>
          </div>
        </div>
      </div>

      {isLoadingUser ? (
        <div className="p-6 text-sm text-slate-300">Vérification des droits...</div>
      ) : !isSuperAdmin ? (
        <div className="p-6 text-sm leading-6 text-slate-300">
          <span className="font-semibold text-sky-300">Accès interdit :</span> cette section est réservée au super administrateur.
        </div>
      ) : (
        <form onSubmit={handleBackup} className="space-y-5 p-5 sm:p-6">
          {message && (
            <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {message}
            </div>
          )}

          {errorMessage && (
            <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {errorMessage}
            </div>
          )}

          <div>
            <label className={labelClassName}>Nom de la sauvegarde</label>
            <input
              type="text"
              className={inputClassName}
              value={nomDeLaSave}
              onChange={(event) => setNomDeLaSave(event.target.value)}
              placeholder="Optionnel, généré automatiquement si vide"
            />
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Une copie est stockée dans uploads/BDD et une autre est téléchargée sur cet appareil.
            </p>
          </div>

          <div>
            <label className={labelClassName}>Mot de passe du superadmin</label>
            <div className="relative">
              <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                className={`${inputClassName} pl-9`}
                value={motDePasse}
                onChange={(event) => setMotDePasse(event.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            {isSaving ? "Sauvegarde en cours..." : "Créer et télécharger la sauvegarde"}
          </button>
        </form>
      )}
    </section>
  );
};

export default ManualBackup;
