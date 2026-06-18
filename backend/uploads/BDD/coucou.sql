-- MySQL dump 10.13  Distrib 9.5.0, for macos15.7 (arm64)
--
-- Host: localhost    Database: DocodeDB
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '5b97935a-c95e-11f0-ab14-3a34581b8135:1-2756';

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('0bc331c9-cf42-40ea-aed8-1efc87bbb0b8','e339a47259d6be52b7a0e44e90fd35ac764631b9671d616584cdda34e0fe5355','2026-06-06 08:02:44.333','20260606143000_add_public_pages',NULL,NULL,'2026-06-06 08:02:44.299',1),('9cd4902a-6c9f-45b0-8894-e64283683be8','c01e0dac0c2dc5ba268d12bc3fd7b2d2e79ff34a9aa7db510aebdee6b0a1a77a','2026-06-06 08:25:30.617','20260606152000_add_page_themes',NULL,NULL,'2026-06-06 08:25:30.574',1),('fd185fde-1010-4d82-b472-b1443964b0a9','9137808838b3e3c30f8f87fe2f4757ad8406c5bccce9866486674d9e3b52b204','2026-06-06 07:10:27.031','20260606120000_init_docode',NULL,NULL,'2026-06-06 07:10:26.964',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Etat`
--

DROP TABLE IF EXISTS `Etat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Etat` (
  `EtatID` int NOT NULL AUTO_INCREMENT,
  `Nom` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `CreateDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `UpdateDate` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`EtatID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Etat`
--

LOCK TABLES `Etat` WRITE;
/*!40000 ALTER TABLE `Etat` DISABLE KEYS */;
INSERT INTO `Etat` VALUES (1,'Actif','2026-06-06 07:10:31.501',NULL),(2,'Supprime','2026-06-06 07:10:31.501',NULL),(3,'Bloque','2026-06-06 07:10:31.501',NULL);
/*!40000 ALTER TABLE `Etat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Grade`
--

DROP TABLE IF EXISTS `Grade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Grade` (
  `GradeID` int NOT NULL AUTO_INCREMENT,
  `Nom` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `CreateDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `UpdateDate` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`GradeID`),
  UNIQUE KEY `Grade_Nom_key` (`Nom`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Grade`
--

LOCK TABLES `Grade` WRITE;
/*!40000 ALTER TABLE `Grade` DISABLE KEYS */;
INSERT INTO `Grade` VALUES (1,'SuperAdmin','2026-06-06 07:10:31.494',NULL),(2,'Admin','2026-06-06 07:10:31.494',NULL);
/*!40000 ALTER TABLE `Grade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PageSection`
--

DROP TABLE IF EXISTS `PageSection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PageSection` (
  `SectionID` int NOT NULL AUTO_INCREMENT,
  `PageID` int NOT NULL,
  `Type` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Titre` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Contenu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `Langage` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CheminFichier` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TexteAlt` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Ordre` int NOT NULL DEFAULT '0',
  `CreateDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `UpdateDate` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`SectionID`),
  KEY `PageSection_PageID_fkey` (`PageID`),
  CONSTRAINT `PageSection_PageID_fkey` FOREIGN KEY (`PageID`) REFERENCES `PublicPage` (`PageID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PageSection`
--

LOCK TABLES `PageSection` WRITE;
/*!40000 ALTER TABLE `PageSection` DISABLE KEYS */;
INSERT INTO `PageSection` VALUES (1,1,'titre','MySQL pour les nul','blablabla sur la base de mysql',NULL,NULL,NULL,1,'2026-06-06 08:05:23.144','2026-06-06 16:13:36.160'),(2,1,'texte','Connexion à MySQL','pour se connecter à Mysql il faut utiliser cette command :',NULL,NULL,NULL,2,'2026-06-06 08:06:15.022','2026-06-06 16:13:36.160'),(3,1,'code',NULL,'mysql -u utilisateur -p','SQL',NULL,NULL,3,'2026-06-06 08:06:40.872','2026-06-06 16:13:36.162');
/*!40000 ALTER TABLE `PageSection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PageTheme`
--

DROP TABLE IF EXISTS `PageTheme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PageTheme` (
  `ThemeID` int NOT NULL AUTO_INCREMENT,
  `Nom` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Slug` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Ordre` int NOT NULL DEFAULT '0',
  `CreateDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `UpdateDate` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`ThemeID`),
  UNIQUE KEY `PageTheme_Slug_key` (`Slug`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PageTheme`
--

LOCK TABLES `PageTheme` WRITE;
/*!40000 ALTER TABLE `PageTheme` DISABLE KEYS */;
INSERT INTO `PageTheme` VALUES (1,'MySQL','mysql',0,'2026-06-06 08:26:02.538',NULL);
/*!40000 ALTER TABLE `PageTheme` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PublicPage`
--

DROP TABLE IF EXISTS `PublicPage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PublicPage` (
  `PageID` int NOT NULL AUTO_INCREMENT,
  `Titre` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Slug` varchar(160) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Ordre` int NOT NULL DEFAULT '0',
  `EstPubliee` tinyint(1) NOT NULL DEFAULT '0',
  `CreateDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `UpdateDate` datetime(3) DEFAULT NULL,
  `ThemeID` int DEFAULT NULL,
  PRIMARY KEY (`PageID`),
  UNIQUE KEY `PublicPage_Slug_key` (`Slug`),
  KEY `PublicPage_ThemeID_fkey` (`ThemeID`),
  CONSTRAINT `PublicPage_ThemeID_fkey` FOREIGN KEY (`ThemeID`) REFERENCES `PageTheme` (`ThemeID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PublicPage`
--

LOCK TABLES `PublicPage` WRITE;
/*!40000 ALTER TABLE `PublicPage` DISABLE KEYS */;
INSERT INTO `PublicPage` VALUES (1,'Test','test','première page de test',0,1,'2026-06-06 08:04:11.408','2026-06-06 08:26:17.839',1);
/*!40000 ALTER TABLE `PublicPage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Utilisateur`
--

DROP TABLE IF EXISTS `Utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Utilisateur` (
  `UtilisateurID` int NOT NULL AUTO_INCREMENT,
  `Surnom` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `MotDePasse` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `CheminImage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Salt` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `GradeID` int NOT NULL,
  `EtatID` int NOT NULL,
  `CreateDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `UpdateDate` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`UtilisateurID`),
  UNIQUE KEY `Utilisateur_Surnom_key` (`Surnom`),
  KEY `Utilisateur_GradeID_fkey` (`GradeID`),
  KEY `Utilisateur_EtatID_fkey` (`EtatID`),
  CONSTRAINT `Utilisateur_EtatID_fkey` FOREIGN KEY (`EtatID`) REFERENCES `Etat` (`EtatID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Utilisateur_GradeID_fkey` FOREIGN KEY (`GradeID`) REFERENCES `Grade` (`GradeID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Utilisateur`
--

LOCK TABLES `Utilisateur` WRITE;
/*!40000 ALTER TABLE `Utilisateur` DISABLE KEYS */;
INSERT INTO `Utilisateur` VALUES (3,'Patrick','$2b$10$DEyPLrtzWJu2nHXaQkhDGuIWWsymdgJgwWp0NCDwpi8KFTxNg1kbe','/uploads/pp/3/1780730783876-1765970338136-ChatGPT Image 17 déc. 2025, 10_41_32 carre.png','patrick@gmail.com','$2b$10$DEyPLrtzWJu2nHXaQkhDGu',1,1,'2026-06-06 07:24:45.448','2026-06-06 07:26:23.886');
/*!40000 ALTER TABLE `Utilisateur` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-18 20:28:39
