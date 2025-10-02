-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: hotel
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
-- Table structure for table `acompanhantes`
--

DROP TABLE IF EXISTS `acompanhantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `acompanhantes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reserva_id` int NOT NULL,
  `nome` varchar(255) NOT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  `passaporte` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reserva_id` (`reserva_id`),
  CONSTRAINT `acompanhantes_ibfk_1` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acompanhantes`
--

LOCK TABLES `acompanhantes` WRITE;
/*!40000 ALTER TABLE `acompanhantes` DISABLE KEYS */;
INSERT INTO `acompanhantes` VALUES (7,19,'gabriel',NULL,NULL,NULL),(8,21,'bruno',NULL,NULL,NULL),(9,23,'gabriel','03732264114','2006-04-30',NULL),(10,24,'ina','12938432343','2002-02-10',NULL),(11,24,'heitor','12343232553','3004-02-10',NULL),(12,25,'gabriel','03732264114','2025-08-18',NULL),(13,33,'bruno','03732264114','2006-04-30',NULL),(14,34,'gabriel','03732264114','2006-04-30',NULL),(15,34,'pedro','12343232553','2006-04-03',NULL),(16,35,'gabriel','03732264114','2006-04-30',NULL),(17,39,'Heitor','06712345690','2006-12-27',NULL),(18,41,'gringo 2',NULL,'2005-04-30','123457');
/*!40000 ALTER TABLE `acompanhantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cadastro_clientes`
--

DROP TABLE IF EXISTS `cadastro_clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cadastro_clientes` (
  `CPF` varchar(11) NOT NULL,
  `Nome` varchar(45) NOT NULL,
  `data_nasc` date NOT NULL,
  `CEP` int NOT NULL,
  `Endereco` varchar(50) DEFAULT NULL,
  `Email` varchar(45) NOT NULL,
  `Telefone` varchar(15) NOT NULL,
  `quarto` int NOT NULL,
  PRIMARY KEY (`CPF`),
  UNIQUE KEY `CPF` (`CPF`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cadastro_clientes`
--

LOCK TABLES `cadastro_clientes` WRITE;
/*!40000 ALTER TABLE `cadastro_clientes` DISABLE KEYS */;
INSERT INTO `cadastro_clientes` VALUES ('12345678901','Teste da Silva Junior','2005-03-20',12345678,'Rua Teste Número B','testedasilva@gmail.com','123456789',32),('12345678911','Teste da Silva Junior Junior','0001-03-20',12345678,'Rua Teste Número C','testedasilva2@gmail.com','123456789',42);
/*!40000 ALTER TABLE `cadastro_clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cardapio`
--

DROP TABLE IF EXISTS `cardapio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cardapio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cardapio`
--

LOCK TABLES `cardapio` WRITE;
/*!40000 ALTER TABLE `cardapio` DISABLE KEYS */;
INSERT INTO `cardapio` VALUES (1,'Coca Fanta',80000000.00);
/*!40000 ALTER TABLE `cardapio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cpf` varchar(14) DEFAULT NULL,
  `nome` varchar(100) NOT NULL,
  `telefone` varchar(15) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `endereco` text,
  `cep` varchar(9) DEFAULT NULL,
  `passaporte` varchar(30) DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  `nacionalidade` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `passaporte` (`passaporte`),
  CONSTRAINT `ck_documento` CHECK (((`cpf` is not null) or (`passaporte` is not null)))
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'03732264114','gabriel','61991892074','gabriiel@gmail.com','Quadra 17','73045173','','2006-04-30','Brasileiro'),(2,'03806978268','Ian Bastos Gonçalves','61981640495','ian.golcalves_pub2410@fac.unb.br','Imperio dos Nobres','73252158',NULL,'2005-10-22','Brasileiro'),(3,'06718562190','Heitor Luiz de Souza Carvalho de Miranda','61992369194','heitor@gmail.com','Condomínio RK','73252200',NULL,'2005-12-27','Brasileiro'),(19,'12345678910','Arthur Prados Piana','6192342345','arthur.piana@gmail.com','Condomínio Império dos Nobres','73252158',NULL,'2006-03-16','Brasileiro'),(26,NULL,'Sobesvaldo','12643234323','sobesvaldo@gmail.com','a','73045173','123457','1994-05-30','viadao'),(27,NULL,'gringo','61992891074','gringo@gmail.com','fora do brasil','73045173','123458','1934-02-10','gringo');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consumos`
--

DROP TABLE IF EXISTS `consumos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consumos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reserva_id` int NOT NULL,
  `produto_id` int NOT NULL,
  `quantidade` int NOT NULL,
  `preco_unitario` decimal(10,2) NOT NULL,
  `data_hora` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `reserva_id` (`reserva_id`),
  KEY `produto_id` (`produto_id`),
  CONSTRAINT `consumos_ibfk_1` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`id`),
  CONSTRAINT `consumos_ibfk_2` FOREIGN KEY (`produto_id`) REFERENCES `produtos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consumos`
--

LOCK TABLES `consumos` WRITE;
/*!40000 ALTER TABLE `consumos` DISABLE KEYS */;
INSERT INTO `consumos` VALUES (9,24,1,75,10.00,'2025-08-18 20:34:43'),(10,33,2,18,22.00,'2025-08-19 19:37:57'),(11,25,3,14,10.00,'2025-08-19 19:38:08'),(12,34,1,29,10.00,'2025-08-19 19:38:27');
/*!40000 ALTER TABLE `consumos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `controle_checkin_check_out`
--

DROP TABLE IF EXISTS `controle_checkin_check_out`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `controle_checkin_check_out` (
  `idcheck_in_check_out` int NOT NULL AUTO_INCREMENT,
  `FkCPF` varchar(11) NOT NULL,
  `data_check_in` date DEFAULT NULL,
  `hora_check_in` time DEFAULT NULL,
  `data_check_out` date DEFAULT NULL,
  `hora_check_out` time DEFAULT NULL,
  `FkNumero` int NOT NULL,
  PRIMARY KEY (`idcheck_in_check_out`),
  KEY `FkNumero` (`FkNumero`),
  KEY `controle_checkin_check_out_ibfk_1` (`FkCPF`),
  CONSTRAINT `controle_checkin_check_out_ibfk_1` FOREIGN KEY (`FkCPF`) REFERENCES `cadastro_clientes` (`CPF`),
  CONSTRAINT `controle_checkin_check_out_ibfk_2` FOREIGN KEY (`FkNumero`) REFERENCES `quartos` (`Numero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `controle_checkin_check_out`
--

LOCK TABLES `controle_checkin_check_out` WRITE;
/*!40000 ALTER TABLE `controle_checkin_check_out` DISABLE KEYS */;
/*!40000 ALTER TABLE `controle_checkin_check_out` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `controle_frigobar`
--

DROP TABLE IF EXISTS `controle_frigobar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `controle_frigobar` (
  `FkNumero` int NOT NULL,
  `Produto` varchar(50) NOT NULL,
  `Quantidade` int NOT NULL,
  `Preco` int NOT NULL,
  PRIMARY KEY (`Produto`),
  KEY `FkNumero` (`FkNumero`),
  CONSTRAINT `controle_frigobar_ibfk_1` FOREIGN KEY (`FkNumero`) REFERENCES `quartos` (`Numero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `controle_frigobar`
--

LOCK TABLES `controle_frigobar` WRITE;
/*!40000 ALTER TABLE `controle_frigobar` DISABLE KEYS */;
/*!40000 ALTER TABLE `controle_frigobar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `preco_unitario` decimal(10,2) NOT NULL,
  `estoque` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
INSERT INTO `produtos` VALUES (1,'coca uva zero',10.00,10),(2,'Suco de cerveja',22.00,10),(3,'cerveja sabor suco',10.00,10);
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quartos`
--

DROP TABLE IF EXISTS `quartos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quartos` (
  `numero` int NOT NULL,
  `tipo_id` int NOT NULL,
  `status` enum('disponivel','ocupado','manutencao','interditado') DEFAULT 'disponivel',
  `descricao` varchar(255) DEFAULT NULL,
  `valor_diaria` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`numero`),
  KEY `tipo_id` (`tipo_id`),
  CONSTRAINT `quartos_ibfk_1` FOREIGN KEY (`tipo_id`) REFERENCES `tiposquarto` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quartos`
--

LOCK TABLES `quartos` WRITE;
/*!40000 ALTER TABLE `quartos` DISABLE KEYS */;
INSERT INTO `quartos` VALUES (1,1,'ocupado','Uma cama',100.00),(5,6,'ocupado','quartao ',500.00),(13,2,'ocupado','2 camas (casal, beliche)',13000.00),(22,3,'disponivel','Duas camas soltero',250.00);
/*!40000 ALTER TABLE `quartos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservas`
--

DROP TABLE IF EXISTS `reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quarto_numero` int NOT NULL,
  `data_checkin` date NOT NULL,
  `hora_checkin` time DEFAULT NULL,
  `data_checkout` date DEFAULT NULL,
  `hora_checkout` time DEFAULT NULL,
  `valor_diaria` decimal(10,2) NOT NULL,
  `desconto` decimal(10,2) DEFAULT '0.00',
  `status` enum('ativo','finalizado','cancelado') DEFAULT 'ativo',
  `motivo_hospedagem` varchar(100) DEFAULT NULL,
  `data_checkout_prevista` date DEFAULT NULL,
  `hora_checkout_prevista` time DEFAULT NULL,
  `cliente_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `quarto_numero` (`quarto_numero`),
  KEY `fk_reservas_clientes` (`cliente_id`),
  CONSTRAINT `fk_reservas_clientes` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`quarto_numero`) REFERENCES `quartos` (`numero`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas`
--

LOCK TABLES `reservas` WRITE;
/*!40000 ALTER TABLE `reservas` DISABLE KEYS */;
INSERT INTO `reservas` VALUES (19,22,'2025-03-12','10:20:00','2025-08-15','20:07:00',250.00,0.00,'finalizado','dicansar','2025-08-16','21:05:00',2),(20,22,'2025-08-15','20:09:00','2025-08-15','20:10:00',250.00,0.00,'finalizado','quer dar a bunda pra uns cara ai','2025-08-16','20:10:00',1),(21,1,'2025-08-12','11:38:00','2025-08-18','12:14:00',100.00,0.00,'finalizado','descansar ne','2025-08-19','11:38:00',2),(22,22,'2025-08-18','12:13:00','2025-08-18','12:14:00',250.00,0.00,'finalizado','descansar ne','2025-08-19','12:13:00',1),(23,13,'2025-08-18','12:57:00','2025-08-18','16:54:00',13000.00,0.00,'finalizado','descansar ne','2025-08-18','13:57:00',2),(24,22,'2025-08-18','17:33:00','2025-08-19','16:33:00',250.00,0.00,'finalizado','quer dar a bunda pra uns cara ai','2025-08-19','17:33:00',1),(25,13,'2025-08-18','18:01:00','2025-08-21','16:09:00',13000.00,0.00,'finalizado','dicansar','2025-08-20','19:02:00',2),(33,22,'2025-08-19','16:34:00','2025-08-21','16:10:00',250.00,0.00,'finalizado','descansar ne','2025-08-20','16:34:00',1),(34,1,'2025-08-19','16:35:00','2025-08-21','16:10:00',100.00,0.00,'finalizado','quer dar a bunda pra dois caras','2025-08-21','17:36:00',3),(35,1,'2025-08-21','16:12:00','2025-08-21','16:16:00',100.00,0.00,'finalizado','teste','2025-08-21','16:15:00',3),(37,1,'2025-08-21','16:17:00','2025-08-21','16:35:00',100.00,0.00,'finalizado',NULL,'2025-08-21','16:20:00',3),(38,1,'2025-10-01','16:30:00',NULL,NULL,100.00,0.00,'ativo','descansar','2025-10-02','16:30:00',19),(39,13,'2025-10-01','16:33:00',NULL,NULL,13000.00,0.00,'ativo','descansar','2025-10-02','16:34:00',1),(40,22,'2025-10-02','10:01:00','2025-10-02','10:02:00',250.00,0.00,'finalizado','desca','2025-10-02','10:03:00',26),(41,5,'2025-10-02','10:20:00',NULL,NULL,500.00,0.00,'ativo','dormir','2025-10-02','10:22:00',27);
/*!40000 ALTER TABLE `reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiposquarto`
--

DROP TABLE IF EXISTS `tiposquarto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiposquarto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(50) NOT NULL,
  `descricao` text,
  `valor_diaria` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tipo` (`tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiposquarto`
--

LOCK TABLES `tiposquarto` WRITE;
/*!40000 ALTER TABLE `tiposquarto` DISABLE KEYS */;
INSERT INTO `tiposquarto` VALUES (1,'Individual','Quarto para uma pessoa',250.00),(2,'Familiar','Quarto para família',400.00),(3,'duplo','duas pessoa',10000.00),(5,'individua','bosta dura',90.00),(6,'quartao','quarto pra um monte de gente ',500.00);
/*!40000 ALTER TABLE `tiposquarto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `nivel_acesso` enum('admin','funcionario') DEFAULT 'funcionario',
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin','123456','Administrador','admin');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-02 10:26:10
