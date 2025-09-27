CREATE DATABASE Hotel;
USE Hotel;
-- Login de cria
CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT,                 
    usuario VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    nivel_acesso ENUM('admin', 'funcionario') DEFAULT 'funcionario',
    PRIMARY KEY(id)
)
ENGINE=InnoDB;

drop database hotel;
CREATE TABLE TiposQuarto (
    id INT AUTO_INCREMENT,         
    tipo VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    valor_diaria DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY(id)
)
ENGINE=InnoDB;
describe clientes;
select * from clientes;
CREATE TABLE Quartos (
    numero INT,
    tipo_id INT NOT NULL,
    status ENUM('disponivel', 'ocupado', 'manutencao') DEFAULT 'disponivel',
    FOREIGN KEY (tipo_id) REFERENCES TiposQuarto(id),
    PRIMARY KEY(numero)
)
ENGINE=InnoDB;


CREATE TABLE Clientes (
    cpf VARCHAR(14),
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    endereco TEXT,
    cep VARCHAR(9),
    PRIMARY KEY(cpf)
)
ENGINE=InnoDB;


-- Check-in brabo
CREATE TABLE Reservas (
    id INT AUTO_INCREMENT,                    
    cliente_cpf VARCHAR(14) NOT NULL,
    quarto_numero INT NOT NULL,
    data_checkin DATE NOT NULL,
    hora_checkin TIME NOT NULL,
    data_checkout DATE,
    hora_checkout TIME,
    valor_diaria DECIMAL(10, 2) NOT NULL,
    desconto DECIMAL(10, 2) DEFAULT 0,
    status ENUM('ativo', 'finalizado', 'cancelado') DEFAULT 'ativo',
    FOREIGN KEY (cliente_cpf) REFERENCES Clientes(cpf),
    FOREIGN KEY (quarto_numero) REFERENCES Quartos(numero),
    PRIMARY KEY(id)
)
ENGINE=InnoDB;


CREATE TABLE Produtos (
    id INT AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    estoque INT DEFAULT 0,
    PRIMARY KEY(id)
)
ENGINE=InnoDB;


CREATE TABLE Consumos (
    id INT AUTO_INCREMENT,
    reserva_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (reserva_id) REFERENCES Reservas(id),
    FOREIGN KEY (produto_id) REFERENCES Produtos(id)
)
ENGINE=InnoDB;

INSERT INTO Usuarios (usuario, senha, nome, nivel_acesso)
VALUES ('admin', '123456', 'Administrador', 'admin');

INSERT INTO TiposQuarto (tipo, descricao, valor_diaria)
VALUES
  ('Individual', 'Quarto para uma pessoa', 250.00),
  ('Familiar', 'Quarto para famÃ­lia', 400.00);
  ALTER TABLE Quartos ADD COLUMN descricao VARCHAR(255);
ALTER TABLE Quartos ADD COLUMN valor_diaria DECIMAL(10,2);
ALTER TABLE Reservas ADD COLUMN motivo_hospedagem VARCHAR(100);
ALTER TABLE Reservas ADD COLUMN motivo_hospedagem VARCHAR(100);
ALTER TABLE Clientes ADD COLUMN passaporte VARCHAR(30);
ALTER TABLE Reservas ADD COLUMN acompanhantes INT DEFAULT 0;
ALTER TABLE Clientes ADD COLUMN data_nascimento DATE;
ALTER TABLE Clientes ADD COLUMN nacionalidade VARCHAR(50);
ALTER TABLE Reservas ADD COLUMN data_checkout_prevista DATE NULL;
ALTER TABLE Reservas ADD COLUMN hora_checkout_prevista TIME NULL;
alter table reservas drop column data_checkout_prevista;
alter table reservas drop column hora_checkout_prevista;

select * from clientes;
use hotel;

ALTER TABLE Acompanhantes
ADD COLUMN cpf VARCHAR(14) NULL,
ADD COLUMN data_nascimento DATE NULL;

create database hotel;
use hotel;



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
  PRIMARY KEY (`id`),
  KEY `reserva_id` (`reserva_id`),
  CONSTRAINT `acompanhantes_ibfk_1` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acompanhantes`
--

LOCK TABLES `acompanhantes` WRITE;
/*!40000 ALTER TABLE `acompanhantes` DISABLE KEYS */;
INSERT INTO `acompanhantes` VALUES (1,15,'osvaldo gamer'),(2,15,'tomás turbano'),(3,15,'shuppa pika'),(4,15,'junin kome bostah');
/*!40000 ALTER TABLE `acompanhantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `cpf` varchar(14) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `telefone` varchar(15) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `endereco` text,
  `cep` varchar(9) DEFAULT NULL,
  `passaporte` varchar(30) DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  `nacionalidade` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`cpf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES ('03732264114','gabriel','61991892074','gabriiel@gmail.com','morro da quadra 17','73045173','','2006-04-30','viado'),('03806978268','ian bundudo golçalves','61981640495','ian.golcalves_pub2410@fac.unb.br','imperio dos pobres ','73252158',NULL,NULL,NULL),('06718562190','heitor luiz de dousa caralho de mirando','61992369194','heitor@gmail.com','condnomio rk (rosca kagada)','73252200','13124124','2005-12-27','preto'),('12345678910','claudio','61661616161','claudio@gmail.com','casa di caralho numero 69','73773733',NULL,NULL,NULL),('12345678911','claudia','99199191919','cladia@gmail.copm','quinto dos inferno','73733731',NULL,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consumos`
--

LOCK TABLES `consumos` WRITE;
/*!40000 ALTER TABLE `consumos` DISABLE KEYS */;
INSERT INTO `consumos` VALUES (1,6,1,2,10.00,'2025-07-01 19:38:18'),(5,11,2,53,22.00,'2025-07-14 21:19:21'),(6,14,1,6,10.00,'2025-08-11 15:25:23'),(7,15,1,22,10.00,'2025-08-11 16:07:07');
/*!40000 ALTER TABLE `consumos` ENABLE KEYS */;
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
  `status` enum('disponivel','ocupado','manutencao') DEFAULT 'disponivel',
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
INSERT INTO `quartos` VALUES (13,2,'disponivel','lula ladrao',13000.00),(22,1,'disponivel','testando de novo',250.00);
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
  `cliente_cpf` varchar(14) NOT NULL,
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
  PRIMARY KEY (`id`),
  KEY `cliente_cpf` (`cliente_cpf`),
  KEY `quarto_numero` (`quarto_numero`),
  CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`cliente_cpf`) REFERENCES `clientes` (`cpf`),
  CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`quarto_numero`) REFERENCES `quartos` (`numero`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas`
--

LOCK TABLES `reservas` WRITE;
/*!40000 ALTER TABLE `reservas` DISABLE KEYS */;
INSERT INTO `reservas` VALUES (5,'06718562190',22,'2025-07-01','13:03:00','2025-07-01','15:55:00',250.00,0.00,'finalizado',NULL,NULL,NULL),(6,'06718562190',22,'2025-07-01','15:55:00','2025-07-14','17:57:00',250.00,0.00,'finalizado',NULL,NULL,NULL),(8,'03732264114',22,'2025-07-02','15:47:00','2025-07-14','11:20:00',250.00,0.00,'finalizado','quer comer o heitor',NULL,NULL),(11,'03732264114',22,'2025-07-13','17:59:00','2025-07-15','17:50:00',250.00,0.00,'finalizado','descansar que o cabao n é de ferro','2025-07-15','18:00:00'),(12,'03732264114',22,'2025-07-15','17:50:00','2025-07-16','18:20:00',250.00,0.00,'finalizado','caçar lobos','2025-07-16','17:50:00'),(13,'03732264114',22,'2025-07-17','16:45:00','2025-07-17','17:27:00',250.00,0.00,'finalizado','dormir ne ','2025-07-17','19:00:00'),(14,'03732264114',22,'2025-08-11','12:11:00','2025-08-11','12:37:00',250.00,0.00,'finalizado','discansar','2025-08-13','12:11:00'),(15,'03732264114',13,'2025-08-11','12:48:00','2025-08-11','13:07:00',13000.00,0.00,'finalizado','discansa com as lendas','2025-08-12','13:49:00'),(16,'03732264114',13,'2025-08-11','13:17:00','2025-08-11','13:17:00',13000.00,0.00,'finalizado','gosto de dormir','2025-08-12','13:17:00'),(17,'03732264114',13,'2025-08-10','13:26:00','2025-08-11','13:26:00',13000.00,0.00,'finalizado','a','2025-08-12','14:27:00');
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

-- Dump completed on 2025-08-11 14:59:54