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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acompanhantes`
--

LOCK TABLES `acompanhantes` WRITE;
/*!40000 ALTER TABLE `acompanhantes` DISABLE KEYS */;
INSERT INTO `acompanhantes` VALUES (1,2,'Heitor Luiz de Souza Carvalho de Miranda','06718562190','2006-12-27',NULL),(2,3,'Gabriel Liduino Costa','03732264114','2006-04-30',NULL),(3,5,'Gabriel ','03732264114','2006-04-30',NULL);
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
  `telefone` varchar(30) DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (2,'03732264114','Gabriel Liduino Costa','61991892074','gabrielliduino@gmail.com','Quadra 17, Conjunto C, 48','73045173',NULL,'2006-04-30','Brasileiro'),(3,'06718562190','Heitor Luiz de Souza Carvalho de Miranda','6192369194','heitor@gmail.com','Condomínio RK, Centauros L 29','73158200',NULL,'2005-12-27','Brasileiro'),(4,'03423349519','Ian Bastos Gonçalves','6181640495','ian@gmail.com','Condomínio Império dos Nobres, Quadra 4, Conjunto H, 29','73158200',NULL,'2006-10-22','Brasileiro'),(5,'92384323843','Teste da Silva','+49 1234 4323434','testedasilva@gmail.com','alemanha','38438423','al123324','2005-04-20','alemao'),(6,NULL,'teste da silva junior','+1 (123) 456-7891','testedasilvajunior@gmail.com','america ne','72312123','am123456','2005-01-23','Americano');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consumos`
--

LOCK TABLES `consumos` WRITE;
/*!40000 ALTER TABLE `consumos` DISABLE KEYS */;
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
INSERT INTO `quartos` VALUES (1,1,'disponivel','Uma cama',100.00),(5,6,'disponivel','quartao ',500.00),(13,2,'disponivel','2 camas (casal, beliche)',13000.00),(22,3,'disponivel','Duas camas soltero',250.00);
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas`
--

LOCK TABLES `reservas` WRITE;
/*!40000 ALTER TABLE `reservas` DISABLE KEYS */;
INSERT INTO `reservas` VALUES (1,1,'2025-10-03','11:56:00','2025-10-04','11:03:00',100.00,0.00,'finalizado','Descanso','2025-10-03','12:00:00',4),(2,5,'2025-10-03','11:58:00','2025-10-04','11:03:00',500.00,0.00,'finalizado','Trabalho','2025-10-03','12:00:00',2),(3,22,'2025-10-04','11:04:00','2025-10-04','11:46:00',250.00,0.00,'finalizado','descansar','2025-10-04','11:06:00',4),(4,1,'2025-10-04','11:05:00','2025-10-24','15:09:00',100.00,0.00,'finalizado','testar','2025-10-09','11:05:00',2),(5,5,'2025-10-04','11:06:00','2025-10-24','15:09:00',500.00,0.00,'finalizado','des','2025-10-18','11:06:00',3);
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
  `nivel_acesso` enum('admin','gerente','padrão') DEFAULT 'padrão',
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin','admin','Administrador','admin');
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

-- Dump completed on 2025-11-11 18:53:00
