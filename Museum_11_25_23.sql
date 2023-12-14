CREATE DATABASE  IF NOT EXISTS `museum` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `museum`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: museum
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `books_and_manuscripts`
--

DROP TABLE IF EXISTS `books_and_manuscripts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books_and_manuscripts` (
  `TITLE` varchar(100) NOT NULL,
  `CREATOR` varchar(50) NOT NULL,
  `DATE_OF_CREATION` varchar(8) DEFAULT NULL,
  `COUNTRY_OF_ORIGIN` varchar(50) DEFAULT NULL,
  `CULTURE` varchar(50) NOT NULL,
  `M_EDIUM` varchar(150) NOT NULL,
  `DIMENSIONS` varchar(50) NOT NULL,
  `DESCRIPT` varchar(1000) NOT NULL,
  `ART_ID` varchar(9) NOT NULL,
  `EXHIB_NUM` varchar(9) DEFAULT NULL,
  `BORROWED` varchar(3) DEFAULT 'no',
  `DEPT_NUM` int NOT NULL,
  `DELETED` varchar(3) DEFAULT 'no',
  PRIMARY KEY (`ART_ID`),
  KEY `EXHIB_NUM` (`EXHIB_NUM`),
  CONSTRAINT `books_and_manuscripts_ibfk_1` FOREIGN KEY (`EXHIB_NUM`) REFERENCES `exhibition` (`EXHIBITION_NUM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books_and_manuscripts`
--

LOCK TABLES `books_and_manuscripts` WRITE;
/*!40000 ALTER TABLE `books_and_manuscripts` DISABLE KEYS */;
INSERT INTO `books_and_manuscripts` VALUES ('2 solitudes','Raymond Meeks','2012','United States','American','Artist\'s book','40.6 × 30.5','2 solitudes” presents a landscape of hardwood forests and rock walls as photographed from my car, suggesting the compression of space, time and memory. even as “inner voice” has summoned stillness and silence, a dominant impulse signals toward a search beyond for level ground and a place of belonging; a beauty which knows the horizon','B12345678','E15844646','no',5,'no'),('Tapeten der Wiener Werkstätte','Maria Likarz','1925','Germany','Austrian','Paper','49.7 × 55.8 × 6.7','This place card comes from a series depicting couples in masks or costumes; the motif is also known as a postcard (Wiener Werkstätte No. 710).','B34567812','E15844646','no',1,'no'),('Theatrum orbis terrarum','Abraham Ortelius','1603','Belgium','Netherlandish','Bound book','45 × 31','The atlas contained virtually no maps from the hand of Ortelius, but 53 bundled maps of other masters, with the source as indicated. Previously, groupings of disparate maps were only released as custom lots, to individual order. In the Ortelius atlas, however, the maps were all in the same style and of the same size, printed from copper plates, logically arranged by continent, region and state. In addition to the maps he provided a descriptive comment and referrals on the reverse. This was the first time that the entirety of Western European knowledge of the world was brought together in one book.','B54321876','E15844646','no',6,'no'),('Ars Moriendi (The Art of Dying)','Konrad Kachelofen','1497','Null','German','Woodcut, letter press and pen and ink initial on laid paper','20.3 × 29.2','Ars Moriendi (The Art of Dying)\" by Konrad Kachelofen. Konrad Kachelofen is a German artist known for his contemporary art, often exploring themes of life and death.','B65432187','E15844646','no',6,'no'),('Concordia Ball Program','Josef Hoffmann','1909','germany','Austrian','Gilt brass, marbled paper, and cord','14.3 × 12.4 × 1.3','Josef Hoffman studied architecture at the Academy of Fine Arts in Vienna under Carl von Hasenauer and Otto Wagner and was influenced by their theories of a functional, modernist architecture. After winning the Rome prize in 1895 and joining Wagner\'s office, he established his own office in 1898 and taught at the Vienna Kunstgewerbeschule from 1899 to 1936. He was a founding member of the Vienna Secession, an avant-garde group of artists and architects. In 1903 he founded the Wiener Werkstätte with Koloman Moser. Hoffman\'s earliest works reflect the Vienna Secession\'s variant of Art Nouveau and his later work shows a pioneering use of geometric and abstract design. His most famous building, the Palais Stoclet in Brussels, built 1905-1911, exemplifies the ideal of the \'Gesamtkunstwerk\' or \'total work of art\'.','B87654321','E15844646','no',1,'no');
/*!40000 ALTER TABLE `books_and_manuscripts` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `books_and_manuscripts_AFTER_INSERT` AFTER INSERT ON `books_and_manuscripts` FOR EACH ROW BEGIN

	INSERT INTO visitor_newaddition_messages (ADDITION_DATE, ADDITION_MESSAGE)
	VALUES (CURRENT_DATE(), 'New "Book and Manuscript" added to collection.');

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `building`
--

DROP TABLE IF EXISTS `building`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `building` (
  `BUILD_NAME` varchar(40) NOT NULL,
  `BUILD_NUM` int NOT NULL,
  `ADDRESS` varchar(40) NOT NULL,
  PRIMARY KEY (`BUILD_NUM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `building`
--

LOCK TABLES `building` WRITE;
/*!40000 ALTER TABLE `building` DISABLE KEYS */;
INSERT INTO `building` VALUES ('Law',1,'1001 Bissonnet St Houston TX 77005'),('Beck',2,'5601 Main St Houston TX 77005'),('Kinder',3,'5500 Main St Houston TX 77004'),('Rienzi',4,'1406 Kirby Dr Houston TX 77019-1412');
/*!40000 ALTER TABLE `building` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ceramics`
--

DROP TABLE IF EXISTS `ceramics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ceramics` (
  `TITLE` varchar(100) NOT NULL,
  `CREATOR` varchar(50) NOT NULL,
  `DATE_OF_CREATION` varchar(8) DEFAULT NULL,
  `COUNTRY_OF_ORIGIN` varchar(50) NOT NULL,
  `CULTURE` varchar(50) NOT NULL,
  `M_EDIUM` varchar(150) NOT NULL,
  `DIMENSIONS` varchar(50) NOT NULL,
  `DESCRIPT` varchar(1000) NOT NULL,
  `ART_ID` varchar(9) NOT NULL,
  `EXHIB_NUM` varchar(9) DEFAULT NULL,
  `BORROWED` varchar(3) DEFAULT 'no',
  `DEPT_NUM` int NOT NULL,
  `DELETED` varchar(3) DEFAULT 'no',
  PRIMARY KEY (`ART_ID`),
  KEY `EXHIB_NUM` (`EXHIB_NUM`),
  CONSTRAINT `ceramics_ibfk_1` FOREIGN KEY (`EXHIB_NUM`) REFERENCES `exhibition` (`EXHIBITION_NUM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ceramics`
--

LOCK TABLES `ceramics` WRITE;
/*!40000 ALTER TABLE `ceramics` DISABLE KEYS */;
INSERT INTO `ceramics` VALUES ('Can you walk from the garden, does your heart understand','Robert Dawson','1996','England','American','Bone China','96.5 x 96.5 x 2.2','Capturing the ephemeral beauty of nature, Robert Dawson\'s 1996 photograph transcends time and space. Entitled \'From Garden to Heart\'s Understanding,\' the image delicately navigates the interplay of light and shadow within an English garden. Dawson\'s lens transforms the ordinary into the extraordinary, rendering Bone China textures and botanical hues with exquisite precision.','C25143429','E02829014','yes',1,'no'),('Pitcher','Edwin Beer Fishley','1870','England','British','Earthenware','17.1 x 19.2 x 15.4','Crafted by the skilled hands of Edwin Beer Fishley in 1870, this exquisite pitcher from England stands as a testament to Victorian-era craftsmanship. Made from fine earthenware, the pitcher boasts an elegant blend of form and function. The British potter\'s meticulous attention to detail is evident in the graceful curves and ornate embellishments adorning the piece.','C32835979','E02829014','yes',1,'no'),('Untitled Vessel','Don Reitz','1980','United States','American','Salt-fired stoneware','76.2 x 58.4 x 58.4','Don Reitz\'s 1980 \"Untitled Vessel\" from the United States is a testament to the expressive beauty of salt-fired stoneware. Crafted with American ingenuity, this vessel encapsulates Reitz\'s mastery of the medium. The unassuming yet sophisticated form invites contemplation, while the salt-firing process adds a dynamic interplay of textures and glazes. Each nuance in the surface tells a story of the intense heat and salt\'s transformative influence during the firing process.','C43219876','E76543219','yes',1,'no'),('Bread and Butter Vase','Jane Ford Aebersold','1981','United States','American','Stoneware','24.1 × 19.1','\"Bread and Butter Vase\" by Jane Ford Aebersold is a ceramic marvel that seamlessly marries functionality with artistic expression. Aebersold\'s creation transforms the mundane into the extraordinary, elevating the everyday object. The vase, with its unique blend of form and utility, stands as a testament to the artist\'s ability to infuse beauty into the simplest elements of our lives.','C47788225','E02829014','yes',1,'no'),('Plate','Edwin Beer Fishley','1870','England','British','Earthenware','4.4 x 29.2','Fashioned by the skilled hands of Edwin Beer Fishley in 1870, this British earthenware plate epitomizes the elegance of the Victorian era. Crafted in England, the plate bears the meticulous details and refined aesthetics characteristic of Fishley\'s work. The gentle curves and intricate patterns on the earthenware surface showcase the artisan\'s dedication to craftsmanship.','C54942386','E02829014','yes',1,'no');
/*!40000 ALTER TABLE `ceramics` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `ceramics_AFTER_INSERT` AFTER INSERT ON `ceramics` FOR EACH ROW BEGIN
	INSERT INTO visitor_newaddition_messages (ADDITION_DATE, ADDITION_MESSAGE)
	VALUES (CURRENT_DATE(), 'New "Ceramics" added to collection.');

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `costumes_and_accessories`
--

DROP TABLE IF EXISTS `costumes_and_accessories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `costumes_and_accessories` (
  `TITLE` varchar(100) NOT NULL,
  `CREATOR` varchar(50) NOT NULL,
  `DATE_OF_CREATION` varchar(8) DEFAULT NULL,
  `COUNTRY_OF_ORIGIN` varchar(50) NOT NULL,
  `CULTURE` varchar(50) NOT NULL,
  `M_EDIUM` varchar(150) NOT NULL,
  `DIMENSIONS` varchar(50) NOT NULL,
  `DESCRIPT` varchar(1000) NOT NULL,
  `ART_ID` varchar(9) NOT NULL,
  `EXHIB_NUM` varchar(9) DEFAULT NULL,
  `BORROWED` varchar(3) DEFAULT 'no',
  `DEPT_NUM` int NOT NULL,
  `DELETED` varchar(3) DEFAULT 'no',
  PRIMARY KEY (`ART_ID`),
  KEY `EXHIB_NUM` (`EXHIB_NUM`),
  CONSTRAINT `costumes_and_accessories_ibfk_1` FOREIGN KEY (`EXHIB_NUM`) REFERENCES `exhibition` (`EXHIBITION_NUM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `costumes_and_accessories`
--

LOCK TABLES `costumes_and_accessories` WRITE;
/*!40000 ALTER TABLE `costumes_and_accessories` DISABLE KEYS */;
INSERT INTO `costumes_and_accessories` VALUES ('Evening Gown','Gigliola Curiel','1964','Italy','Italian','Schiffli machine embroidered silk, horsehair tape, sequins','139.7 × 30.5','Step into the epitome of mid-20th-century Italian glamour with this enchanting Evening Gown by Gigliola Curiel, crafted in 1964. The gown, a masterpiece of Italian couture, is a testament to Curiel\'s innovative design and meticulous craftsmanship.','A23456789','E15844646','no',1,'no'),('Evening Gown','Elinor Simmons','1965','United States','American','Silk faille, organza, sequins, paillettes, brilliants, and seed beads','53 1/2 × 29','Indulge in the timeless allure of this 1965 Evening Gown by American designer Elinor Simmons. Crafted in the United States, the gown is a masterpiece of elegance, blending luxurious materials and meticulous detailing. Silk faille and organza create a sumptuous canvas, while sequins, paillettes, brilliants, and seed beads intricately embellish the gown. Each element contributes to a symphony of texture and sparkle, transforming the wearer into a vision of sophistication.','A34567891','E15844646','no',1,'no'),('Ensemble','Yves Saint Laurent','1982','France','French','Abraham silk, bugle beads, seed beads, paillettes','99.1 × 48.3','Immerse yourself in the unparalleled craftsmanship of Yves Saint Laurent with this 1982 Ensemble, a true embodiment of French haute couture. Crafted in France, the ensemble features luxurious Abraham silk adorned with meticulous embellishments. Bugle beads, seed beads, and paillettes intricately dance across the fabric, creating a mesmerizing interplay of texture and light. The ensemble, with its impeccable design and attention to detail, encapsulates Yves Saint Laurent\'s genius.','A65432198','E76543219','no',1,'no'),('Meisen Unlined Robe','Unknown Japanese','1955','Japan','Japanese','Warp, machine-spun silk','147.3 × 121.9','The delicate beauty of the garment unfolds in a harmonious dance of intricate patterns and muted hues, a reflection of the Meisen weaving technique\'s timeless artistry. Unknown hands meticulously wove threads to create a tapestry of refined simplicity.','A87654321','E15844646','no',7,'no');
/*!40000 ALTER TABLE `costumes_and_accessories` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `costumes_and_accessories_AFTER_INSERT` AFTER INSERT ON `costumes_and_accessories` FOR EACH ROW BEGIN
	INSERT INTO visitor_newaddition_messages (ADDITION_DATE, ADDITION_MESSAGE)
	VALUES (CURRENT_DATE(), 'New "Costume and Accessories" added to collection.');

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `DNAME` varchar(50) NOT NULL,
  `DNUM` int NOT NULL,
  `DBUILDNUM` int NOT NULL,
  `MANAGER_ID` varchar(7) NOT NULL,
  `NUM_OF_EMPLOYEES` int NOT NULL,
  PRIMARY KEY (`DNUM`),
  KEY `DBUILDNUM` (`DBUILDNUM`),
  CONSTRAINT `department_ibfk_1` FOREIGN KEY (`DBUILDNUM`) REFERENCES `building` (`BUILD_NUM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES ('DECORATIVE ARTS, CRAFT, AND DESIGN',1,1,'H678901',1),('Rienzi',2,4,'H890123',2),('Modern and Contemporary Art',3,1,'H789012',1),('Prints and Drawings',4,3,'H901234',1),('Photography',5,1,'H213339',1),('Sarah Campbell Blaffer Foundation',6,2,'H834126',1),('Asian Art',7,3,'H472636',1),('Arts of Europe and the Mediterranean',8,2,'H374573',1),('Photography',9,1,'H748473',1),('Gift Shop',10,2,'H213339',2),('Theater',11,1,'H901234',3);
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `FNAME` varchar(15) NOT NULL,
  `MNAME` varchar(15) DEFAULT NULL,
  `LNAME` varchar(15) NOT NULL,
  `EMPLOYEE_ID` varchar(10) NOT NULL,
  `GENDER` varchar(1) NOT NULL,
  `ETHNICITY` varchar(50) NOT NULL,
  `ROLL` varchar(35) NOT NULL,
  `DEPNUM` int NOT NULL,
  `SALARY` int NOT NULL,
  PRIMARY KEY (`EMPLOYEE_ID`),
  KEY `DEPNUM` (`DEPNUM`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`DEPNUM`) REFERENCES `department` (`DNUM`),
  CONSTRAINT `employee_chk_1` CHECK (((`SALARY` >= 1) and (`SALARY` <= 1000000)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES ('Robert','E','Wilson','H213339','M','Asian','Manager',5,100000),('Ron','E','Shane','H321232','M','Caucasian','Theater',11,40000),('James','R','Danger','H374573','M','Caucasian','Manager',8,100000),('Benjamin','O','Williams','H472636','M','Asian','Manager',7,90000),('Jessica','J','Clark','H678901','F','Caucasian','Manager',1,85000),('Paul','W','Art','H748473','M','Hispanic','Manager',9,90000),('Sarah','D','Taylor','H789012','F','Hispanic','Manager',3,90000),('Samantha','N','Adams','H834126','F','African American','Manager',6,100000),('Linda','F','Lee','H890123','M','Asian','Manager',2,64000),('James','I','Anderson','H901234','M','African American','Manager',4,95000),('Sophia','P','Thomas','H952341','M','Caucasian','Curator',2,50000),('Jack','S','Rook','H953443','M','Native American','Gift Shop',10,40000);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `department_validation1` BEFORE INSERT ON `employee` FOR EACH ROW BEGIN

    DECLARE DEPARTMENT_COUNT INT;
    SELECT COUNT(*) INTO DEPARTMENT_COUNT
    FROM DEPARTMENT
    WHERE DNUM = NEW.DEPNUM;

    IF DEPARTMENT_COUNT = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid department ID';
    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `salary_threshold_insert` BEFORE INSERT ON `employee` FOR EACH ROW BEGIN

    DECLARE man_salary_threshold INT;
    DECLARE cur_salary_threshold INT;
    DECLARE gsatt_salary_threshold INT;
    
    -- Set the salary threshold
    SET man_salary_threshold = 120000;
    SET cur_salary_threshold = 80000;
    SET gsatt_salary_threshold = 25000;
    
    -- Check if the new salary exceeds their role's limit
    IF NEW.ROLL = 'MANAGER' THEN
		IF NEW.SALARY > man_salary_threshold THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Employee has a salary above their role''s limit!';
		END IF;
	ELSEIF NEW.ROLL = 'CURATOR' THEN
		IF NEW.SALARY > cur_salary_threshold THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Employee has a salary above their role''s limit!';
		END IF;
	ELSEIF NEW.ROLL = 'ATTENDANT' THEN
		IF NEW.SALARY > gsatt_salary_threshold THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Employee has a salary above their role''s limit!';
		END IF;
    
    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `department_count_updater` AFTER INSERT ON `employee` FOR EACH ROW BEGIN

    UPDATE DEPARTMENT
    SET NUM_OF_EMPLOYEES = NUM_OF_EMPLOYEES + 1
    WHERE DNUM = NEW.DEPNUM;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `department_validation2` BEFORE UPDATE ON `employee` FOR EACH ROW BEGIN

    DECLARE DEPARTMENT_COUNT INT;
    SELECT COUNT(*) INTO DEPARTMENT_COUNT
    FROM DEPARTMENT
    WHERE DNUM = NEW.DEPNUM;

    IF DEPARTMENT_COUNT = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid department ID';
    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `salary_threshold_update` BEFORE UPDATE ON `employee` FOR EACH ROW BEGIN

    DECLARE man_salary_threshold INT;
    DECLARE cur_salary_threshold INT;
	DECLARE gsatt_salary_threshold INT;
    
    
    -- Set the salary threshold
    SET man_salary_threshold = 120000;
    SET cur_salary_threshold = 80000;
    SET gsatt_salary_threshold = 25000;
    
    -- Check if the new salary exceeds their role's limit
    IF NEW.ROLL = 'MANAGER' THEN
		IF NEW.SALARY > man_salary_threshold THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Employee has a salary above their role''s limit!';
		END IF;
	ELSEIF NEW.ROLL = 'CURATOR' THEN
		IF NEW.SALARY > cur_salary_threshold THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Employee has a salary above their role''s limit!';
		END IF;
	ELSEIF NEW.ROLL = 'ATTENDANT' THEN
		IF NEW.SALARY > gsatt_salary_threshold THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Employee has a salary above their role''s limit!';
		END IF;
        
        
    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `exhibition`
--

DROP TABLE IF EXISTS `exhibition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exhibition` (
  `EXHIBITION_NAME` varchar(100) NOT NULL,
  `EXHIBITION_NUM` varchar(9) NOT NULL,
  `START_DATE` varchar(15) DEFAULT NULL,
  `END_DATE` varchar(15) DEFAULT NULL,
  `BUILD_NUM` int NOT NULL,
  `DESCRIPT` varchar(1000) NOT NULL,
  PRIMARY KEY (`EXHIBITION_NUM`),
  KEY `BUILD_NUM` (`BUILD_NUM`),
  CONSTRAINT `exhibition_ibfk_1` FOREIGN KEY (`BUILD_NUM`) REFERENCES `building` (`BUILD_NUM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exhibition`
--

LOCK TABLES `exhibition` WRITE;
/*!40000 ALTER TABLE `exhibition` DISABLE KEYS */;
INSERT INTO `exhibition` VALUES ('Garth Clark and Mark Del Vecchio Collection','E02829014','08-07-2023','08-07-2023',2,'New York-based scholars and gallerists Garth Clark and Mark Del Vecchio have been leaders in the ceramics field for three decades, assembling one of the most important private collections of contemporary ceramics in the world. In 2007, the MFAH acquired the Garth Clark and Mark Del Vecchio Collection of some 475 artworks, as well as the accompanying library and artist archive.'),('Permanent Collection','E15844646','12-12-1943',NULL,1,'This is the permanent collection on display'),('Margo Grant Walsh Collection of Architect-Designed Metalwork','E23137468','05-24-2023','11-18-2023',3,'Step into the Margo Grant Walsh Collection of Architect-Designed Metalwork—an exquisite fusion of artistry and functionality. This exhibit transcends the boundaries between form and function, showcasing a curated selection of masterfully crafted metal pieces conceived by visionary architects. Each creation tells a unique story, marrying aesthetics with purpose. From avant-garde furniture to intricate sculptures, the collection is a testament to the marriage of design and metallurgy. Immerse yourself in the interplay of light and shadow, the marriage of innovation and tradition, as these metal masterpieces redefine the boundaries of utilitarian beauty.'),('Helen Williams Drutt Collection of Contemporary Studio Jewelry','E42758045','05-24-2023','08-07-2023',2,'This collection is a remarkable showcase of contemporary studio jewelry, presenting a diverse and extraordinary array of artistic expressions in the realm of adornment. Visitors will be captivated by the ingenuity and craftsmanship of the artists whose works are featured. From innovative designs to exquisite materials, this exhibition promises to offer a unique and enriching experience, shedding light on the ever-evolving landscape of jewelry art. Don\'t miss the opportunity to immerse yourself in this remarkable journey through the world of contemporary studio jewelry during these dates.'),('Leatrice and Melvin Eagle Collection of Contemporary Craft','E76543219','12-03-2021','08-12-2023',1,'This exhibit unveils a captivating array of contemporary craftworks, ranging from textiles to ceramics, reflecting the Eagles\' discerning eye for the avant-garde. Immerse yourself in the tactile allure of each piece, where traditional techniques meet modern expression. The collection is a testament to the artists\' dedication to pushing boundaries, fostering a dialogue between tradition and experimentation. Journey through this captivating showcase, where every object is a testament to the enduring power of human creativity and the boundless possibilities within the realm of contemporary craft.');
/*!40000 ALTER TABLE `exhibition` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `exhibition_AFTER_INSERT` AFTER INSERT ON `exhibition` FOR EACH ROW BEGIN
	INSERT INTO visitor_newaddition_messages (ADDITION_DATE, ADDITION_MESSAGE)
	VALUES (CURRENT_DATE(), 'New Exhibition added.');

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `exhibition_ticket`
--

DROP TABLE IF EXISTS `exhibition_ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exhibition_ticket` (
  `EVENT_NAME` varchar(100) NOT NULL,
  `EXHIBIT_NUM` varchar(9) NOT NULL,
  `TICKET_ID` varchar(9) NOT NULL,
  `COST_U_12` decimal(9,2) DEFAULT NULL,
  `COST_12_TO_65` decimal(9,2) DEFAULT NULL,
  `COST_65_PLUS` decimal(9,2) DEFAULT NULL,
  `DATE_OF_EVENT` varchar(10) NOT NULL,
  `EVENT_START_TIME` varchar(7) DEFAULT NULL,
  `EVENT_END_TIME` varchar(7) DEFAULT NULL,
  PRIMARY KEY (`TICKET_ID`),
  KEY `EXHIBIT_NUM` (`EXHIBIT_NUM`),
  CONSTRAINT `exhibition_ticket_ibfk_1` FOREIGN KEY (`EXHIBIT_NUM`) REFERENCES `exhibition` (`EXHIBITION_NUM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exhibition_ticket`
--

LOCK TABLES `exhibition_ticket` WRITE;
/*!40000 ALTER TABLE `exhibition_ticket` DISABLE KEYS */;
INSERT INTO `exhibition_ticket` VALUES ('Permanent Collection','E15844646','ET1247890',8.00,10.00,8.00,'12-17-2023','02 p.m.','04 p.m.'),('Permanent Collection','E15844646','ET2085960',8.00,10.00,8.00,'12-17-2023','10 a.m.','12 p.m.'),('Permanent Collection','E15844646','ET2354780',8.00,10.00,8.00,'12-18-2023','04 p.m.','06 p.m.'),('Permanent Collection','E15844646','ET3768290',8.00,10.00,8.00,'12-18-2023','10 a.m.','12 p.m.'),('Margo Grant Walsh Collection of Architect-Designed Metalwork','E23137468','ET4196870',8.00,10.00,8.00,'12-18-2023','04 p.m.','06 p.m.'),('Permanent Collection','E15844646','ET5012430',8.00,10.00,8.00,'12-18-2023','12 p.m.','02 p.m.'),('Garth Clark and Mark Del Vecchio Collection','E02829014','ET5213490',8.00,10.00,8.00,'12-05-2023','01 p.m.','03 p.m.'),('Helen Williams Drutt Collection of Contemporary Studio Jewelry','E42758045','ET5729410',8.00,10.00,8.00,'12-06-2023','04 p.m.','06 p.m.'),('Permanent Collection','E15844646','ET5823640',8.00,10.00,8.00,'12-17-2023','06 p.m.','08 p.m.'),('Permanent Collection','E15844646','ET6458300',8.00,10.00,8.00,'12-17-2023','12 p.m.','02 p.m.'),('Margo Grant Walsh Collection of Architect-Designed Metalwork','E23137468','ET7531240',8.00,10.00,8.00,'12-17-2023','04 p.m.','06 p.m.'),('Permanent Collection','E15844646','ET7692100',8.00,10.00,8.00,'12-18-2023','06 p.m.','08 p.m.'),('Leatrice and Melvin Eagle Collection of Contemporary Craft','E76543219','ET8362050',3.00,5.00,3.00,'12-07-2023','12 p.m.','02 p.m.'),('Permanent Collection','E15844646','ET8941620',8.00,10.00,8.00,'12-18-2023','02 p.m.','04 p.m.'),('Permanent Collection','E15844646','ET9603170',8.00,10.00,8.00,'12-17-2023','04 p.m.','06 p.m.');
/*!40000 ALTER TABLE `exhibition_ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exhibition_transaction`
--

DROP TABLE IF EXISTS `exhibition_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exhibition_transaction` (
  `TICKET_TRANSACTION_ID` int NOT NULL AUTO_INCREMENT,
  `DATE_OF_SALE` varchar(10) NOT NULL,
  `TICKET_ID` varchar(10) NOT NULL,
  `VISIT_ID` int NOT NULL,
  `NUM_PURCHASED_U_12` int NOT NULL,
  `NUM_PURCHASED_12_TO_65` int NOT NULL,
  `NUM_PURCHASED_65_PLUS` int NOT NULL,
  `DISCOUNT` int DEFAULT '0',
  `TRANSACTION_TOTAL` int NOT NULL,
  PRIMARY KEY (`TICKET_TRANSACTION_ID`),
  KEY `TICKET_ID` (`TICKET_ID`),
  KEY `VISIT_ID` (`VISIT_ID`),
  CONSTRAINT `exhibition_transaction_ibfk_1` FOREIGN KEY (`TICKET_ID`) REFERENCES `exhibition_ticket` (`TICKET_ID`),
  CONSTRAINT `exhibition_transaction_ibfk_2` FOREIGN KEY (`VISIT_ID`) REFERENCES `visitor` (`VISIT_ID`),
  CONSTRAINT `exhibition_transaction_chk_1` CHECK ((`NUM_PURCHASED_U_12` >= 0)),
  CONSTRAINT `exhibition_transaction_chk_2` CHECK ((`NUM_PURCHASED_12_TO_65` >= 0)),
  CONSTRAINT `exhibition_transaction_chk_3` CHECK ((`NUM_PURCHASED_65_PLUS` >= 0)),
  CONSTRAINT `exhibition_transaction_chk_4` CHECK ((`DISCOUNT` <= 100))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exhibition_transaction`
--

LOCK TABLES `exhibition_transaction` WRITE;
/*!40000 ALTER TABLE `exhibition_transaction` DISABLE KEYS */;
INSERT INTO `exhibition_transaction` VALUES (1,'11-23-2023','ET5213490',1132342,1,1,1,0,26),(2,'11-23-2023','ET5213490',1132342,1,1,1,0,26),(3,'11-23-2023','ET5213490',1132342,1,1,1,0,26),(4,'11-23-2023','ET5213490',1132342,1,1,1,0,26),(6,'10-25-2023','ET1247890',1132342,2,1,1,0,34),(7,'10-23-2023','ET4196870',9012345,1,0,0,0,10),(8,'11-24-2023','ET2354780',4567890,1,0,0,0,10);
/*!40000 ALTER TABLE `exhibition_transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gift_shop`
--

DROP TABLE IF EXISTS `gift_shop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gift_shop` (
  `ITEM_NAME` varchar(100) NOT NULL DEFAULT 'item_name',
  `ITEM_ID` char(10) NOT NULL DEFAULT 'item_id',
  `ITEM_COST` double NOT NULL DEFAULT '0',
  `DISCOUNT` int DEFAULT '0',
  `GIFT_STOCK` double NOT NULL,
  `DESCRIPT` varchar(1000) NOT NULL DEFAULT 'description',
  `DELETED` varchar(3) DEFAULT 'NO',
  PRIMARY KEY (`ITEM_ID`),
  CONSTRAINT `gift_shop_chk_1` CHECK ((`DISCOUNT` < 100)),
  CONSTRAINT `gift_shop_chk_2` CHECK (((`GIFT_STOCK` >= 0) and (`GIFT_STOCK` <= 10000)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gift_shop`
--

LOCK TABLES `gift_shop` WRITE;
/*!40000 ALTER TABLE `gift_shop` DISABLE KEYS */;
INSERT INTO `gift_shop` VALUES ('Cat Basket','G123456789',65,0,22,'Offer your pet a cozy home, a little place to snuggle just for them. Hand-made by artisans in Nepal, the Cat Basket by Muskane, with its refined style and natural form, is a decorative item that you’ll love to show off.','no'),('Mother of Pearl Chandelier Earrings','G234567890',120,0,0,'These beautiful Mother of Pearl Chandelier Earrings make an exquisite addition to any formal outfit. Their opaline iridescence casts a luminous light that will make you sparkle for any occasion.','no'),('Pink Glass Cherry Studs','G345678912',63,0,16,'Get your fruity fix with these juicy Pink Glass Cherry Studs!','no'),('Left Right Crayons','G432198765',11,0,34,'Are you right handed? Left handed? Ambidextrous? It doesn\'t matter with the Left Right Crayons, they are ergonomic for everyone! These easy-to-hold crayons make drawing works of art comfortable and fun. Left Right Crayons are made with an eco-friendly polymer, are nontoxic and completely erasable. Set of 10 beautiful colors.','no'),('Van Gogh \"Hospital at Saint-Remy\" Puzzle','G543219876',24,0,2,'Vincent van Gogh, Hospital at Saint-Rémy, 1889. Oil on canvas. 36 5/16 x 28 7/8 in. (92.2 x 73.4 cm). The Armand HammerCollection, Gift of the Armand Hammer Foundation. Hammer Museum, Los Angeles.','no'),('John Singer Sargent: Watercolors','G654321987',60,0,4,'John Singer Sargent’s approach to watercolor was unconventional. Going beyond turn-of-the-century standards for carefully delineated and composed landscapes filled with transparent washes, his confidently bold, dense strokes and loosely defined forms startled critics and fellow practitioners alike. One reviewer of an exhibition in London proclaimed him “an eagle in a dove-cote”; another called his work “swagger” watercolors. For Sargent, however, the watercolors were not so much about swagger as about a renewed and liberated approach to painting. ','no'),('Hibi Incense Matches Box of 8','G876543210',14,0,58,'Incense matches are delicate and should be lit more gently than a standard match. Hold the match close to the tip and carefully strike in a straight line and wait for the flame to reach the incense stick. A lighter can also be used. Once lit, blow out the flame and place it on the burning pad provided.','no'),('Grand Illusion Table','G987654321',475,0,0,'Illusion is a timeless statement of beauty, simplicity and functionality. \"One day I was passing a Café in Copenhagen. There were round tables with white tablecloths. Each cloth was square and almost touched the floor. I stopped and took a couple photos. I then went to a plastic workshop, showed them the image and asked if it was possible to make such an object in plastic. The answer was no. But I continued my quest and after a few months some samples were ready. The result was Illusion, a stunning example of Symbolic Functionalism that has received an extremely enthusiastic reception from both the press and consumers.\"','no');
/*!40000 ALTER TABLE `gift_shop` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `gift_shop_AFTER_INSERT` AFTER INSERT ON `gift_shop` FOR EACH ROW BEGIN
	INSERT INTO visitor_newaddition_messages (ADDITION_DATE, ADDITION_MESSAGE)
	VALUES (CURRENT_DATE(), 'New Item added to the Gift Shop. Check it out!');

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `gift_error_adder` AFTER UPDATE ON `gift_shop` FOR EACH ROW BEGIN

    IF NEW.GIFT_STOCK = 0 THEN
        INSERT INTO GIFT_SHOP_ERROR (ERROR_DATE, MESSAGE, RESOLVED)
        VALUES (CURRENT_DATE(), CONCAT('Item "', NEW.ITEM_NAME, '" is out of stock.'), 'no');
    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `gift_shop_error`
--

DROP TABLE IF EXISTS `gift_shop_error`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gift_shop_error` (
  `ERROR_ID` int NOT NULL AUTO_INCREMENT,
  `ERROR_DATE` varchar(10) DEFAULT NULL,
  `MESSAGE` varchar(500) DEFAULT NULL,
  `RESOLVED` varchar(3) DEFAULT 'no',
  PRIMARY KEY (`ERROR_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gift_shop_error`
--

LOCK TABLES `gift_shop_error` WRITE;
/*!40000 ALTER TABLE `gift_shop_error` DISABLE KEYS */;
INSERT INTO `gift_shop_error` VALUES (13,'2023-11-23','Item \"Grand Illusion Table\" is out of stock.','no'),(14,'2023-11-25','Item \"Mother of Pearl Chandelier Earrings\" is out of stock.','no');
/*!40000 ALTER TABLE `gift_shop_error` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gift_shop_transaction`
--

DROP TABLE IF EXISTS `gift_shop_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gift_shop_transaction` (
  `GIFT_SHOP_TRANSACTION_ID` int NOT NULL AUTO_INCREMENT,
  `DATE_OF_SALE` varchar(10) NOT NULL,
  `ITEM_ID` varchar(10) NOT NULL,
  `VISIT_ID` int NOT NULL,
  `NUM_ITEMS_PURCHASED` int NOT NULL,
  `DISCOUNT` int DEFAULT '0',
  `TRANSACTION_TOTAL` int NOT NULL,
  PRIMARY KEY (`GIFT_SHOP_TRANSACTION_ID`),
  KEY `GIFT_ID` (`ITEM_ID`),
  KEY `VISIT_ID` (`VISIT_ID`),
  CONSTRAINT `gift_shop_transaction_ibfk_1` FOREIGN KEY (`ITEM_ID`) REFERENCES `gift_shop` (`ITEM_ID`),
  CONSTRAINT `gift_shop_transaction_ibfk_2` FOREIGN KEY (`VISIT_ID`) REFERENCES `visitor` (`VISIT_ID`),
  CONSTRAINT `gift_shop_transaction_chk_1` CHECK ((`NUM_ITEMS_PURCHASED` >= 0)),
  CONSTRAINT `gift_shop_transaction_chk_2` CHECK ((`DISCOUNT` <= 100))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gift_shop_transaction`
--

LOCK TABLES `gift_shop_transaction` WRITE;
/*!40000 ALTER TABLE `gift_shop_transaction` DISABLE KEYS */;
INSERT INTO `gift_shop_transaction` VALUES (8,'11-23-2023','G123456789',1132342,1,0,65),(10,'10-25-2023','G654321987',2345678,4,0,240);
/*!40000 ALTER TABLE `gift_shop_transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jewelry`
--

DROP TABLE IF EXISTS `jewelry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jewelry` (
  `TITLE` varchar(100) NOT NULL,
  `CREATOR` varchar(50) NOT NULL,
  `DATE_OF_CREATION` varchar(8) DEFAULT NULL,
  `COUNTRY_OF_ORIGIN` varchar(50) NOT NULL,
  `CULTURE` varchar(50) NOT NULL,
  `M_EDIUM` varchar(150) NOT NULL,
  `DIMENSIONS` varchar(50) NOT NULL,
  `DESCRIPT` varchar(1000) NOT NULL,
  `ART_ID` varchar(9) NOT NULL,
  `EXHIB_NUM` varchar(9) DEFAULT NULL,
  `BORROWED` varchar(3) DEFAULT 'no',
  `DEPT_NUM` int NOT NULL,
  `DELETED` varchar(3) DEFAULT 'no',
  PRIMARY KEY (`ART_ID`),
  KEY `EXHIB_NUM` (`EXHIB_NUM`),
  CONSTRAINT `jewelry_ibfk_1` FOREIGN KEY (`EXHIB_NUM`) REFERENCES `exhibition` (`EXHIBITION_NUM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jewelry`
--

LOCK TABLES `jewelry` WRITE;
/*!40000 ALTER TABLE `jewelry` DISABLE KEYS */;
INSERT INTO `jewelry` VALUES ('Feasting Armlets','Marjorie Schick','1991','United States','American','Papier mâché and paint','33×27.9×22.5','Marjorie Schick\'s \"Feasting Armlets,\" a remarkable work of art from 1991, originates from the heart of American creativity. Measuring 33 by 27.9 by 22.5 centimeters, these armlets are a testament to Schick\'s mastery of unconventional materials. Crafted from papier mâché and adorned with intricate hand-painted details, they are a captivating fusion of art and adornment. The armlets evoke a sense of exuberance, resembling festive accessories that transport wearers to a vibrant celebration. Schick\'s innovative use of papier mâché and paint transforms these armlets into wearable sculptures, inviting you to embrace a world of artistic expression and revelry, right at your fingertips.','J01820368','E42758045','yes',1,'no'),('Brooch','Reinhold Reiling','1970','Germany','German','Silver and gold','5.7×4.4×0.5','This exquisite jewelry brooch, crafted by renowned German artist Reinhold Reiling in 1970, is a stunning testament to the fusion of tradition and innovation. Measuring 5.7 by 4.4 by 0.5 centimeters, this masterpiece showcases Reiling\'s mastery of form and material. Fashioned from the finest German silver and gold, the brooch exhibits a delicate balance between simplicity and intricacy. Its design evokes a harmonious blend of geometric patterns and organic motifs, evoking a sense of timeless elegance. This remarkable piece encapsulates the essence of German craftsmanship, serving as a symbol of cultural heritage and artistic excellence, perfect for adorning any sophisticated attire.','J36668499','E42758045','yes',1,'no'),('Abolitionist Brooch','Josiah Wedgwood & Sons','1787','England','English','Jasperware, glass, and brass','3.2×2.9×0.6','The \"Abolitionist Brooch\" created by Josiah Wedgwood & Sons in 1787 is a remarkable artifact of historical significance. Crafted in England, this English jasperware brooch measures 3.2 by 2.9 by 0.6 centimeters. It serves as a potent symbol of the abolitionist movement, advocating for the end of the transatlantic slave trade. The brooch combines delicate craftsmanship with a powerful message, using materials like jasperware, glass, and brass. Its intricate design and anti-slavery motif make it a tangible representation of the moral and political struggle for freedom and justice, underscoring its enduring importance in the history of social reform.','J58079476','E15844646','no',1,'no'),('O.T.','Karl Fritsch','1993','Germany','German','Gold and brass','2.3×1.3×1','Karl Fritsch\'s \"O.T.\" (Untitled) piece, created in Germany in 1993, is a striking testament to the artist\'s innovative approach to jewelry design. Measuring a delicate 2.3 by 1.3 by 1 centimeters, this jewel is a harmonious blend of gold and brass. Fritsch\'s work embodies a distinct German craftsmanship, showcasing intricate details and expert metalwork. The use of contrasting metals adds depth and character to this compact yet visually compelling creation. The piece\'s untitled nature invites viewers to interpret its meaning, while its small size makes it a wearable work of art, perfect for those who appreciate the fusion of aesthetics and precious materials.','J84207048','E42758045','yes',1,'no');
/*!40000 ALTER TABLE `jewelry` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `jewelry_AFTER_INSERT` AFTER INSERT ON `jewelry` FOR EACH ROW BEGIN
	INSERT INTO visitor_newaddition_messages (ADDITION_DATE, ADDITION_MESSAGE)
	VALUES (CURRENT_DATE(), 'New "Jewelry" added to collection.');

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `metalworks`
--

DROP TABLE IF EXISTS `metalworks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metalworks` (
  `TITLE` varchar(100) NOT NULL,
  `CREATOR` varchar(50) NOT NULL,
  `DATE_OF_CREATION` varchar(8) DEFAULT NULL,
  `COUNTRY_OF_ORIGIN` varchar(50) NOT NULL,
  `CULTURE` varchar(50) NOT NULL,
  `M_EDIUM` varchar(150) NOT NULL,
  `DIMENSIONS` varchar(50) NOT NULL,
  `DESCRIPT` varchar(1000) NOT NULL,
  `ART_ID` varchar(9) NOT NULL,
  `EXHIB_NUM` varchar(9) DEFAULT NULL,
  `BORROWED` varchar(3) DEFAULT 'no',
  `DEPT_NUM` int NOT NULL,
  `DELETED` varchar(3) DEFAULT 'no',
  PRIMARY KEY (`ART_ID`),
  KEY `EXHIB_NUM` (`EXHIB_NUM`),
  CONSTRAINT `metalworks_ibfk_1` FOREIGN KEY (`EXHIB_NUM`) REFERENCES `exhibition` (`EXHIBITION_NUM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metalworks`
--

LOCK TABLES `metalworks` WRITE;
/*!40000 ALTER TABLE `metalworks` DISABLE KEYS */;
INSERT INTO `metalworks` VALUES ('Versailles Toast Rack','Maurizio Duranti','1995','Italy','Italian','Sterling silver and plastic','4.4 × 21.9 × 10.8','is an exquisite blend of Italian design and functionality. Crafted from sterling silver and plastic, this toast rack is a contemporary homage to opulence and practicality. The juxtaposition of materials adds a modern twist to a classic form, marrying traditional craftsmanship with a touch of innovation. The name \"Versailles\" suggests a nod to grandeur, and indeed, this toast rack embodies a sense of timeless elegance and refined taste.','M00190039','E23137468','no',1,'no'),('\"Hokusai\" Necklace','Afra Bianchin Scarpa','2007','Italy','Italian','Sterling silver','40 × 1','A long chain composed of links made with square section thick sterling silver profile','M07459397','E23137468','no',1,'no'),('Set of Four Teaspoons','Charles Rennie Mackintosh','1905','United Kingdom','Scottish','Electroplated nickel silver','2.5 × 12.7','If you\'re referring to a specific work by Charles Rennie Mackintosh, could you please provide more details or clarify your request? Mackintosh was a renowned Scottish architect, designer, and artist associated with the Arts and Crafts Movement and Art Nouveau.','M32739347','E23137468','no',1,'no'),('Pair of Lions','Unknown Indian','1880','India','Udaipur','Silver over wood','59.5 x 69.2 x 24.8','Step into the regal world of 19th-century India with our captivating exhibit featuring a Pair of Lions from Udaipur. Crafted in 1880, this stunning masterpiece showcases the unparalleled artistry of an unknown Indian artisan. Gaze upon the majestic silver over wood sculpture, marveling at the intricate details that bring these lions to life.','M32923033','E15844646','no',7,'no');
/*!40000 ALTER TABLE `metalworks` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `metalworks_AFTER_INSERT` AFTER INSERT ON `metalworks` FOR EACH ROW BEGIN
	INSERT INTO visitor_newaddition_messages (ADDITION_DATE, ADDITION_MESSAGE)
	VALUES (CURRENT_DATE(), 'New "Metalworks" added to collection.');

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `painting`
--

DROP TABLE IF EXISTS `painting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `painting` (
  `TITLE` varchar(100) NOT NULL,
  `CREATOR` varchar(50) NOT NULL,
  `DATE_OF_CREATION` varchar(8) DEFAULT NULL,
  `COUNTRY_OF_ORIGIN` varchar(50) NOT NULL,
  `CULTURE` varchar(50) NOT NULL,
  `M_EDIUM` varchar(150) NOT NULL,
  `DIMENSIONS` varchar(50) NOT NULL,
  `DESCRIPT` varchar(1000) NOT NULL,
  `ART_ID` varchar(9) NOT NULL,
  `EXHIB_NUM` varchar(9) DEFAULT NULL,
  `BORROWED` varchar(3) DEFAULT 'no',
  `DEPT_NUM` int NOT NULL,
  `DELETED` varchar(3) DEFAULT 'no',
  PRIMARY KEY (`ART_ID`),
  KEY `EXHIB_NUM` (`EXHIB_NUM`),
  CONSTRAINT `painting_ibfk_1` FOREIGN KEY (`EXHIB_NUM`) REFERENCES `exhibition` (`EXHIBITION_NUM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `painting`
--

LOCK TABLES `painting` WRITE;
/*!40000 ALTER TABLE `painting` DISABLE KEYS */;
INSERT INTO `painting` VALUES ('Head of a Woman','George Romney','1786','England','English','Oil on canvas','42.8 x 36.8','Romney\'s skillful rendering of the woman\'s features conveys a subtle blend of strength and vulnerability, while the interplay of light and shadow adds a captivating depth to this portrait, inviting viewers into a contemplative exploration of beauty and emotion.','P23456789','E15844646','no',2,'no'),('Baigneuse au Chapeau','Jean Pollet','no date','France','French','Oil on canvas','118.1 x 83.8','\"Baigneuse au Chapeau\" by Jean Pollet is a captivating portrayal of a bathing woman adorned with a hat. Pollet\'s brushwork delicately captures the play of light on her figure, while the hat adds an element of mystery. The scene exudes a serene yet alluring atmosphere, inviting viewers to immerse themselves in the timeless beauty of the bather.','P87654321','E15844646',NULL,2,'no');
/*!40000 ALTER TABLE `painting` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `painting_AFTER_INSERT` AFTER INSERT ON `painting` FOR EACH ROW BEGIN
	INSERT INTO visitor_newaddition_messages (ADDITION_DATE, ADDITION_MESSAGE)
	VALUES (CURRENT_DATE(), 'New "Painting" added to collection.');

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `photography`
--

DROP TABLE IF EXISTS `photography`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `photography` (
  `TITLE` varchar(100) NOT NULL,
  `CREATOR` varchar(50) NOT NULL,
  `DATE_OF_CREATION` varchar(8) DEFAULT NULL,
  `COUNTRY_OF_ORIGIN` varchar(50) NOT NULL,
  `CULTURE` varchar(50) NOT NULL,
  `M_EDIUM` varchar(150) NOT NULL,
  `DIMENSIONS` varchar(50) NOT NULL,
  `DESCRIPT` varchar(1000) NOT NULL,
  `ART_ID` varchar(9) NOT NULL,
  `EXHIB_NUM` varchar(9) DEFAULT NULL,
  `BORROWED` varchar(3) DEFAULT 'no',
  `DEPT_NUM` int NOT NULL,
  `DELETED` varchar(3) DEFAULT 'no',
  PRIMARY KEY (`ART_ID`),
  KEY `EXHIB_NUM` (`EXHIB_NUM`),
  CONSTRAINT `photography_ibfk_1` FOREIGN KEY (`EXHIB_NUM`) REFERENCES `exhibition` (`EXHIBITION_NUM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photography`
--

LOCK TABLES `photography` WRITE;
/*!40000 ALTER TABLE `photography` DISABLE KEYS */;
INSERT INTO `photography` VALUES ('[Studio of François Flameng, Paris]','Unknown','1924','France','Unknown','Gelatin silver print','9.6 x 22.9','Explore the captivating ambiance of artistic synergy in \"Studio of François Flameng, Paris.\" This evocative photograph encapsulates a pivotal moment within the renowned studio, where skilled artists converge amid a symphony of easels.','G03847538','E15844646','no',9,'no'),('As Far As I Can Get Closer to the Border in 10 Seconds After Divola','William Camargo','2021','United States','American','Inkjet print','61.1 x 76.3','in honor of Lisa Volpe','G38903424','E15844646','no',9,'no'),('Texaco Oil Refinery Worker, Port Arthur, Texas','Arthur Leipzig','954','United States','American','Gelatin silver print','22.1 x 22.9','Embark on a visual voyage into the heart of American industry with our compelling exhibit featuring \"Texaco Oil Refinery Worker, Port Arthur, Texas\" captured by the lens of Arthur Leipzig in 1954. This evocative gelatin silver print immortalizes the toil and resilience of an American laborer against the backdrop of the burgeoning oil industry.','G75947308','E15844646','no',9,'no'),('[Japanese Scenes and People]','Kusakabe Kimbei','1880','Japan','Japanese','Album of albumen silver prints with applied color','32 x 40 x 3.5 cm','This captivating photograph encapsulates the essence of traditional craftsmanship as a skilled artisan meticulously crafts Japanese umbrellas. The scene unfolds with an air of serene precision, revealing the artisan\'s dedication to his craft.','G93475326','E15844646','no',9,'no');
/*!40000 ALTER TABLE `photography` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `photography_AFTER_INSERT` AFTER INSERT ON `photography` FOR EACH ROW BEGIN
	INSERT INTO visitor_newaddition_messages (ADDITION_DATE, ADDITION_MESSAGE)
	VALUES (CURRENT_DATE(), 'New "Photography" added to collection.');

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `sculptures`
--

DROP TABLE IF EXISTS `sculptures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sculptures` (
  `TITLE` varchar(100) NOT NULL,
  `CREATOR` varchar(50) NOT NULL,
  `DATE_OF_CREATION` varchar(8) DEFAULT NULL,
  `COUNTRY_OF_ORIGIN` varchar(50) NOT NULL,
  `CULTURE` varchar(50) NOT NULL,
  `M_EDIUM` varchar(150) NOT NULL,
  `DIMENSIONS` varchar(50) NOT NULL,
  `DESCRIPT` varchar(1000) NOT NULL,
  `ART_ID` varchar(9) NOT NULL,
  `EXHIB_NUM` varchar(9) DEFAULT NULL,
  `BORROWED` varchar(3) DEFAULT 'no',
  `DEPT_NUM` int NOT NULL,
  `DELETED` varchar(3) DEFAULT 'no',
  PRIMARY KEY (`ART_ID`),
  KEY `EXHIB_NUM` (`EXHIB_NUM`),
  CONSTRAINT `sculptures_ibfk_1` FOREIGN KEY (`EXHIB_NUM`) REFERENCES `exhibition` (`EXHIBITION_NUM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sculptures`
--

LOCK TABLES `sculptures` WRITE;
/*!40000 ALTER TABLE `sculptures` DISABLE KEYS */;
INSERT INTO `sculptures` VALUES ('Virgin and Child','Mino da Fiesole','1470','Italy','Italian','Marble','52.1 x 39.7 x 8.9','by the Italian sculptor Mino da Fiesole, \"Virgin and Child\" is a sublime masterpiece crafted from marble. This evocative sculpture captures the tender moment between the Virgin Mary and the infant Jesus, radiating grace and maternal love. Mino da Fiesole\'s virtuosity in carving marble is showcased in the intricate details of the drapery and the expressive faces','S12473952','E15844646','no',8,'no'),('Powder Box and Offering in River and Jade','Amber Cowan','2022','United States','American','American pressed glass, metal, and paint','47 x 39 x 21','\"Powder Box and Offering in River and Jade,\" is a striking testament to contemporary American artistry. Crafted in the United States, this piece melds American pressed glass with metal and intricately painted jade reef accents. The delicate interplay of textures and colors captures the essence of Cowan\'s unique vision.','S37476391','E15844646','no',1,'no'),('Le Silence','Auguste Préault','1843','France','French','Plaster','40.5 x 40.5 x 19.7','is a poignant French sculpture rendered in plaster. This masterpiece encapsulates Préault\'s ability to infuse raw emotion into his work. The figure of \"Le Silence\" exudes a quiet and contemplative demeanor, capturing a moment frozen in time. Préault\'s sculptural finesse is evident in the delicate details that evoke a sense of serenity and introspection.','S37493613','E15844646','no',8,'no'),('Flying Mercury','Giambologna','1580','Italy','Italian','Bronze, on a colored marble base','71.1 x 17.3 x 31.8','cast in bronze in 1580 in Italy, stands as an enduring testament to the Italian Renaissance\'s artistic prowess. This masterful sculpture captures the dynamic essence of Mercury, the messenger of the gods, in mid-flight. The fluidity of movement, expertly rendered in bronze, showcases Giambologna\'s extraordinary skill and understanding of anatomy.','S74948222','E15844646','no',8,'no'),('Route','Tuan Phan','2007','United States','American','Mixed media','61.6 x 26.3 x 21','is a compelling piece of contemporary American art crafted in the United States. Composed with mixed media, Phan\'s work invites viewers into a visual journey that transcends traditional boundaries. The interplay of various materials reveals a dynamic exploration of form and texture, while the title suggests a narrative or path waiting to be discovered.','S83458478','E15844646','no',3,'no');
/*!40000 ALTER TABLE `sculptures` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `sculptures_AFTER_INSERT` AFTER INSERT ON `sculptures` FOR EACH ROW BEGIN
	INSERT INTO visitor_newaddition_messages (ADDITION_DATE, ADDITION_MESSAGE)
	VALUES (CURRENT_DATE(), 'New "Sculpture" added to collection.');

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `theater_ticket`
--

DROP TABLE IF EXISTS `theater_ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `theater_ticket` (
  `FILM_NAME` varchar(100) NOT NULL,
  `THEATER_TICKET_ID` varchar(9) NOT NULL,
  `FILM_ID` char(9) DEFAULT NULL,
  `COST_U_12` decimal(9,2) DEFAULT NULL,
  `COST_12_TO_65` decimal(9,2) DEFAULT NULL,
  `COST_65_PLUS` decimal(9,2) DEFAULT NULL,
  `SEAT_COUNT` int NOT NULL,
  `DATE_OF_EVENT` varchar(10) NOT NULL,
  `EVENT_START_TIME` varchar(7) DEFAULT NULL,
  `EVENT_END_TIME` varchar(7) DEFAULT NULL,
  PRIMARY KEY (`THEATER_TICKET_ID`),
  KEY `FILM_ID` (`FILM_ID`),
  CONSTRAINT `theater_ticket_ibfk1` FOREIGN KEY (`FILM_ID`) REFERENCES `theatre` (`FILM_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theater_ticket`
--

LOCK TABLES `theater_ticket` WRITE;
/*!40000 ALTER TABLE `theater_ticket` DISABLE KEYS */;
INSERT INTO `theater_ticket` VALUES ('Four Daughters','FT2932773','F52932773',10.00,10.00,8.00,97,'12-19-2023','04 p.m.','06 p.m.'),('Rush to Judgment','FT5355560','F05355560',10.00,10.00,8.00,87,'12-19-2023','04 p.m.','06 p.m.'),('Family Portrait','FT5666457','F95666457',10.00,10.00,8.00,24,'12-15-2023','04 p.m.','06 p.m.'),('Cobweb','FT6208822','F56208822',10.00,10.00,8.00,100,'12-16-2023','04 p.m.','06 p.m.'),('The Herricanes','FT9668325','F29668325',10.00,10.00,8.00,76,'12-17-2023','04 p.m.','06 p.m.');
/*!40000 ALTER TABLE `theater_ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `theater_transaction`
--

DROP TABLE IF EXISTS `theater_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `theater_transaction` (
  `TICKET_TRANSACTION_ID` int NOT NULL AUTO_INCREMENT,
  `DATE_OF_SALE` varchar(10) NOT NULL,
  `THEATER_TICKET_ID` varchar(9) NOT NULL,
  `VISIT_ID` int NOT NULL,
  `NUM_PURCHASED_U_12` int NOT NULL,
  `NUM_PURCHASED_12_TO_65` int NOT NULL,
  `NUM_PURCHASED_65_PLUS` int NOT NULL,
  `DISCOUNT` int DEFAULT '0',
  `TRANSACTION_TOTAL` int NOT NULL,
  PRIMARY KEY (`TICKET_TRANSACTION_ID`),
  KEY `VISIT_ID` (`VISIT_ID`),
  KEY `theater_transaction_ibfk_2_idx` (`THEATER_TICKET_ID`),
  CONSTRAINT `theater_transaction_ibfk_1` FOREIGN KEY (`VISIT_ID`) REFERENCES `visitor` (`VISIT_ID`),
  CONSTRAINT `theater_transaction_ibfk_2` FOREIGN KEY (`THEATER_TICKET_ID`) REFERENCES `theater_ticket` (`THEATER_TICKET_ID`),
  CONSTRAINT `theater_transaction_chk_1` CHECK ((`NUM_PURCHASED_U_12` >= 0)),
  CONSTRAINT `theater_transaction_chk_2` CHECK ((`NUM_PURCHASED_12_TO_65` >= 0)),
  CONSTRAINT `theater_transaction_chk_3` CHECK ((`NUM_PURCHASED_65_PLUS` >= 0)),
  CONSTRAINT `theater_transaction_chk_4` CHECK ((`DISCOUNT` <= 100))
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theater_transaction`
--

LOCK TABLES `theater_transaction` WRITE;
/*!40000 ALTER TABLE `theater_transaction` DISABLE KEYS */;
INSERT INTO `theater_transaction` VALUES (9,'11-23-2023','FT5666457',1132342,1,1,1,0,28),(14,'10-25-2023','FT2932773',2345678,2,1,1,0,38);
/*!40000 ALTER TABLE `theater_transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `theatre`
--

DROP TABLE IF EXISTS `theatre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `theatre` (
  `FILM_NAME` varchar(100) NOT NULL,
  `DIRECTOR` varchar(70) NOT NULL,
  `RUNTIME` int NOT NULL,
  `FILM_ID` char(9) NOT NULL,
  `START_DATE` varchar(10) NOT NULL,
  `END_DATE` varchar(10) NOT NULL,
  `DESCRIPT` varchar(1000) NOT NULL,
  PRIMARY KEY (`FILM_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theatre`
--

LOCK TABLES `theatre` WRITE;
/*!40000 ALTER TABLE `theatre` DISABLE KEYS */;
INSERT INTO `theatre` VALUES ('Rush to Judgment','Emile de Antonio',124,'F05355560','11-19-2023','12-19-2023','Scheduled to coincide with the 60th anniversary of the Kennedy assassination, the new digital restoration of the documentary Rush to Judgment presents a convincing legal argument that the Warren Commission was incorrect in suggesting that Lee Harvey Oswald single-handedly killed President John F. Kennedy.'),('The Herricanes','Olivia Kuan',87,'F29668325','11-05-2023','12-17-2023','The Houston Herricanes were a part of the first women’s full-tackle football league in the 1970s. Their unknown story is one of commitment, courage, and strength. Despite adversity and hardship, they fielded a team purely for the love of the game. What they started was a movement that is still in motion today'),('Four Daughters','Kaouther Ben Hania',107,'F52932773','11-15-2023','12-19-2023','Tunisia’s submission to the Academy Awards is a riveting exploration of rebellion, memory, and sisterhood that reconstructs the story of Olfa Hamrouni and her four daughters.'),('Cobweb','Jee-woon Kim',87,'F56208822','11-11-2023','12-15-2023','Set in the 1970s, this chaotically entertaining comedy about filmmaking finds a director causing upheaval when he decides to reshoot the ending of his latest movie, confident it will then be a masterpiece.'),('Family Portrait','Lucy Kerr',78,'F95666457','11-10-2023','12-17-2023','Set at the dawn of COVID, Family Portrait follows a sprawling family on a morning when they have planned a group picture. After the mother disappears and one of the daughters becomes increasingly anxious to find her and take the picture, the rest of the family appears to resist any attempt to gather.');
/*!40000 ALTER TABLE `theatre` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `theatre_AFTER_INSERT` AFTER INSERT ON `theatre` FOR EACH ROW BEGIN
	INSERT INTO visitor_newaddition_messages (ADDITION_DATE, ADDITION_MESSAGE)
	VALUES (CURRENT_DATE(), 'New Film added to Theater.');

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `timepieces`
--

DROP TABLE IF EXISTS `timepieces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timepieces` (
  `TITLE` varchar(100) NOT NULL,
  `CREATOR` varchar(50) NOT NULL,
  `DATE_OF_CREATION` varchar(8) DEFAULT NULL,
  `COUNTRY_OF_ORIGIN` varchar(50) NOT NULL,
  `CULTURE` varchar(50) NOT NULL,
  `M_EDIUM` varchar(150) NOT NULL,
  `DIMENSIONS` varchar(50) NOT NULL,
  `DESCRIPT` varchar(1000) NOT NULL,
  `ART_ID` varchar(9) NOT NULL,
  `EXHIB_NUM` varchar(9) DEFAULT NULL,
  `BORROWED` varchar(3) DEFAULT 'no',
  `DEPT_NUM` int NOT NULL,
  `DELETED` varchar(3) DEFAULT 'no',
  PRIMARY KEY (`ART_ID`),
  KEY `EXHIB_NUM` (`EXHIB_NUM`),
  CONSTRAINT `timepieces_ibfk_1` FOREIGN KEY (`EXHIB_NUM`) REFERENCES `exhibition` (`EXHIBITION_NUM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timepieces`
--

LOCK TABLES `timepieces` WRITE;
/*!40000 ALTER TABLE `timepieces` DISABLE KEYS */;
INSERT INTO `timepieces` VALUES ('Arch Clock','Wendell Castle','1985','United States','American','Brazilian rosewood, curly maple, gold-plated brass','232.4 × 143.5 × 48.3','a testament to American craftsmanship, stands as an elegant fusion of form and function. Crafted in the United States, the clock showcases the meticulous artistry of Castle. The use of Brazilian rosewood and curly maple imparts warmth and richness to the design, while gold-plated brass accents add a touch of opulence. The arch shape lends a sense of grace and timeless sophistication to this functional timepiece','T34567891','E76543219','yes',1,'no'),('\"Dr. Caligari\" Mantle Clock','Wendell Castle','2004','United States','American','Mahogany, gesso, aniline dye, and quartz movement clockworks','49.5 × 27 × 15.9','Wendell Castle\'s 2004 \"Dr. Caligari\" Mantle Clock, a mesmerizing creation from the United States, embodies the intersection of art and timekeeping. Crafted with precision and artistry, the clock is composed of mahogany adorned with gesso, aniline dye, and houses quartz movement clockworks. The name, a nod to the iconic film, reflects the clock\'s surreal and intriguing design. As a functional sculpture, this piece transforms the mundane act of timekeeping into an artistic experience.','T6038347Z','E15844646','no',1,'no'),('Clock','Henrik Wigström','1915','Russia','Russian','White jade, nephrite, gold, silver-gilt, diamonds, emeralds, enamel, and glass','11.4 × 7 × 5.6','this exquisite clock is a testament to the opulence of the Russian Imperial Court. Fashioned from white jade and nephrite, the clock is a symphony of luxurious materials including gold, silver-gilt, diamonds, emeralds, enamel, and glass. The meticulous craftsmanship is evident in the intricate details and precision of the clockwork.','T76543218','E15844646','no',2,'no'),('Grandfather Clock','Maarten Baas','2004','Netherlands','Dutch','Oak, metal, glass, epoxy resin, and polyurethane lacquer','212.1 × 49.5 × 25.4','Maarten Baas\'s 2004 Grandfather Clock, a Dutch masterpiece, transcends conventional timekeeping with its avant-garde design. Crafted in the Netherlands, this extraordinary timepiece stands at the intersection of tradition and contemporary art. Constructed from oak, metal, glass, epoxy resin, and polyurethane lacquer, it challenges the boundaries of form and function','T87654321','E15844646','no',1,'no');
/*!40000 ALTER TABLE `timepieces` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `timepieces_AFTER_INSERT` AFTER INSERT ON `timepieces` FOR EACH ROW BEGIN
	INSERT INTO visitor_newaddition_messages (ADDITION_DATE, ADDITION_MESSAGE)
	VALUES (CURRENT_DATE(), 'New "Timepiece" added to collection.');

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `visitor`
--

DROP TABLE IF EXISTS `visitor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visitor` (
  `NAME` varchar(20) NOT NULL,
  `EMAIL` varchar(40) NOT NULL,
  `VISIT_ID` int NOT NULL,
  PRIMARY KEY (`VISIT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitor`
--

LOCK TABLES `visitor` WRITE;
/*!40000 ALTER TABLE `visitor` DISABLE KEYS */;
INSERT INTO `visitor` VALUES ('Luna Sanchez','luna.sanchez@gmail.com',1132342),('Oliver Robinson','oliver.robinson@gmail.com',1234566),('Leo Carter','leo.carter@gmail.com',2132134),('Jasper Mitchell','jasper.mitchell@gmail.com',2345678),('Zara Lewis','zara.lewis@gmail.com',3248384),('Hudson Clark','hudson.clark@gmail.com',4567890),('Aria Patel','aria.patel@gmail.com',7384832),('Eva Parker','eva.parker@gmail.com',7890123),('Maya Nelson','maya.nelson@gmail.com',8901234),('Nolan Thompson','nolan.thompson@gmail.com',9012345);
/*!40000 ALTER TABLE `visitor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visitor_newaddition_messages`
--

DROP TABLE IF EXISTS `visitor_newaddition_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visitor_newaddition_messages` (
  `MESSAGE_ID` int NOT NULL AUTO_INCREMENT,
  `ADDITION_DATE` varchar(10) DEFAULT NULL,
  `ADDITION_MESSAGE` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`MESSAGE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitor_newaddition_messages`
--

LOCK TABLES `visitor_newaddition_messages` WRITE;
/*!40000 ALTER TABLE `visitor_newaddition_messages` DISABLE KEYS */;
INSERT INTO `visitor_newaddition_messages` VALUES (5,'2023-11-24','New \"Painting\" added to collection.'),(6,'2023-11-24','New \"Painting\" added to collection.'),(7,'2023-11-24','New \"Painting\" added to collection.'),(8,'2023-11-24','New \"Painting\" added to collection.'),(9,'2023-11-24','New Film added to Theater.'),(10,'2023-11-24','New Exhibition added.'),(11,'2023-11-24','New \"Jewelry\" added to collection.'),(12,'2023-11-24','New Item added to the Gift Shop. Check it out!');
/*!40000 ALTER TABLE `visitor_newaddition_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `works_on`
--

DROP TABLE IF EXISTS `works_on`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `works_on` (
  `EMPNUMBER` varchar(10) NOT NULL,
  `HOURSWORKED` int NOT NULL,
  `DEPNUM` int DEFAULT NULL,
  `WEEKOF` varchar(10) NOT NULL,
  `MONTHOF` decimal(2,0) DEFAULT NULL,
  PRIMARY KEY (`EMPNUMBER`,`WEEKOF`),
  KEY `DEPNUM` (`DEPNUM`),
  CONSTRAINT `works_on_ibfk_1` FOREIGN KEY (`EMPNUMBER`) REFERENCES `employee` (`EMPLOYEE_ID`),
  CONSTRAINT `works_on_ibfk_2` FOREIGN KEY (`DEPNUM`) REFERENCES `department` (`DNUM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `works_on`
--

LOCK TABLES `works_on` WRITE;
/*!40000 ALTER TABLE `works_on` DISABLE KEYS */;
INSERT INTO `works_on` VALUES ('H213339',35,5,'43-2023',10),('H213339',18,5,'45-2023',11),('H321232',40,11,'43-2023',10),('H321232',26,11,'45-2023',11),('H472636',12,7,'43-2023',10),('H472636',45,7,'45-2023',11),('H678901',40,1,'43-2023',10),('H678901',30,1,'45-2023',11),('H789012',40,3,'43-2023',10),('H789012',16,3,'45-2023',11),('H834126',35,6,'43-2023',10),('H834126',29,6,'45-2023',11),('H890123',40,2,'43-2023',10),('H890123',24,2,'45-2023',11),('H901234',40,4,'43-2023',10),('H901234',38,4,'45-2023',11),('H952341',10,2,'43-2023',10),('H952341',45,2,'45-2023',11),('H953443',20,10,'43-2023',10),('H953443',35,10,'45-2023',11);
/*!40000 ALTER TABLE `works_on` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-25 19:51:17
