import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.grade.createMany({
    data: [
      { GradeID: 1, Nom: "SuperAdmin" },
      { GradeID: 2, Nom: "Admin" },
    ],
    skipDuplicates: true,
  });

  await prisma.etat.createMany({
    data: [
      { EtatID: 1, Nom: "Actif" },
      { EtatID: 2, Nom: "Supprime" },
      { EtatID: 3, Nom: "Bloque" },
    ],
    skipDuplicates: true,
  });

  const superAdminSurnom = process.env.SEED_SUPERADMIN_SURNOM;
  const superAdminEmail = process.env.SEED_SUPERADMIN_EMAIL;
  const superAdminPassword = process.env.SEED_SUPERADMIN_PASSWORD;

  if (!superAdminSurnom || !superAdminEmail || !superAdminPassword) {
    console.log("Seed de base terminé. Aucun super administrateur créé sans variables SEED_SUPERADMIN_*.");
    return;
  }

  const existingSuperAdmin = await prisma.utilisateur.findFirst({
    where: {
      OR: [
        { Surnom: superAdminSurnom },
        { Email: superAdminEmail },
      ],
    },
  });

  if (existingSuperAdmin) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(superAdminPassword, salt);

    await prisma.utilisateur.update({
      where: { UtilisateurID: existingSuperAdmin.UtilisateurID },
      data: {
        Surnom: superAdminSurnom,
        Email: superAdminEmail,
        MotDePasse: hashedPassword,
        Salt: salt,
        GradeID: 1,
        EtatID: 1,
      },
    });

    console.log("Super administrateur initial synchronisé.");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(superAdminPassword, salt);

  await prisma.utilisateur.create({
    data: {
      Surnom: superAdminSurnom,
      Email: superAdminEmail,
      MotDePasse: hashedPassword,
      Salt: salt,
      GradeID: 1,
      EtatID: 1,
    },
  });

  console.log("Super administrateur initial créé.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
