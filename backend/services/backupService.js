import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const BACKUP_DIR = path.join(__dirname, "../uploads/BDD");

function ensureBackupDir() {
  return fs.promises.mkdir(BACKUP_DIR, { recursive: true });
}

function sanitizeFilePart(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}

function getTimestampParts() {
  const timestamp = new Date();
  const year = timestamp.getFullYear();
  const month = String(timestamp.getMonth() + 1).padStart(2, "0");
  const day = String(timestamp.getDate()).padStart(2, "0");
  const hours = String(timestamp.getHours()).padStart(2, "0");
  const minutes = String(timestamp.getMinutes()).padStart(2, "0");
  const seconds = String(timestamp.getSeconds()).padStart(2, "0");

  return { year, month, day, hours, minutes, seconds };
}

function buildBackupFileName({ manual = false, backupName } = {}) {
  const { year, month, day, hours, minutes, seconds } = getTimestampParts();
  const safeDbName = sanitizeFilePart(DB_NAME) || "database";
  const safeBackupName = sanitizeFilePart(backupName);

  if (safeBackupName) {
    return `${safeBackupName}.sql`;
  }

  if (manual) {
    return `BDD_${safeDbName}_${year}-${month}-${day}_${hours}-${minutes}-${seconds}_manuel.sql`;
  }

  return `BDD_${safeDbName}_${year}-${month}-${day}.sql`;
}

export async function backupDatabase(options = {}) {
  if (!DB_HOST || !DB_USER || !DB_NAME) {
    throw new Error("Configuration de base de données incomplète pour la sauvegarde.");
  }

  await ensureBackupDir();

  const fileName = buildBackupFileName(options);
  const filePath = path.join(BACKUP_DIR, fileName);
  const dumpArgs = ["-h", DB_HOST, "-u", DB_USER];

  if (DB_PASSWORD) {
    dumpArgs.push(`-p${DB_PASSWORD}`);
  }

  dumpArgs.push(DB_NAME);

  await new Promise((resolve, reject) => {
    const dump = spawn("mysqldump", dumpArgs);
    const output = fs.createWriteStream(filePath, { flags: "w" });
    let stderr = "";
    let dumpClosed = false;
    let outputFinished = false;
    let settled = false;

    const rejectOnce = (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };

    const resolveWhenComplete = () => {
      if (settled || !dumpClosed || !outputFinished) return;
      settled = true;
      resolve();
    };

    dump.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    dump.on("error", (error) => {
      output.destroy();
      rejectOnce(error);
    });

    output.on("error", (error) => {
      dump.kill();
      rejectOnce(error);
    });

    dump.stdout.pipe(output);

    dump.on("close", (code) => {
      if (code !== 0) {
        rejectOnce(new Error(stderr || `mysqldump a terminé avec le code ${code}.`));
        return;
      }
      dumpClosed = true;
      resolveWhenComplete();
    });

    output.on("finish", () => {
      outputFinished = true;
      resolveWhenComplete();
    });
  });

  return { fileName, filePath };
}
