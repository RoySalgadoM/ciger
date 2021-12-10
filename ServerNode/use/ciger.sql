-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema ciger
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema ciger
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ciger` DEFAULT CHARACTER SET utf8 ;
USE `ciger` ;

-- -----------------------------------------------------
-- Table `ciger`.`USER`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ciger`.`USER` (
  `idUser` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `date_created` DATETIME NOT NULL,
  `date_updated` DATETIME NOT NULL,
  `role` SMALLINT NOT NULL,
  `status` SMALLINT NOT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ciger`.`PERSON`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ciger`.`PERSON` (
  `idPerson` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `surname` VARCHAR(45) NOT NULL,
  `secondSurname` VARCHAR(45) NULL,
  `date_created` DATETIME NOT NULL,
  `date_updated` DATETIME NOT NULL,
  `status` SMALLINT NOT NULL,
  `idUser` INT NOT NULL,
  PRIMARY KEY (`idPerson`),
  INDEX `fk_PERSON_USER_idx` (`idUser` ASC) ,
  CONSTRAINT `fk_PERSON_USER`
    FOREIGN KEY (`idUser`)
    REFERENCES `ciger`.`USER` (`idUser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ciger`.`CATEGORY`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ciger`.`CATEGORY` (
  `idCategory` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `date_created` DATETIME NOT NULL,
  `date_updated` VARCHAR(45) NOT NULL,
  `status` SMALLINT NOT NULL,
  PRIMARY KEY (`idCategory`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ciger`.`MOVIE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ciger`.`MOVIE` (
  `idMovie` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `originalTitle` VARCHAR(45) NOT NULL,
  `description` VARCHAR(45) NOT NULL,
  `runningTime` VARCHAR(45) NOT NULL,
  `imgURL` VARCHAR(45) NOT NULL,
  `price` DECIMAL NOT NULL,
  `date_created` DATETIME NOT NULL,
  `date_updated` DATETIME NOT NULL,
  `status` SMALLINT NOT NULL,
  `id_category` INT NOT NULL,
  PRIMARY KEY (`idMovie`),
  INDEX `fk_MOVIE_CATEGORY1_idx` (`id_category` ASC) ,
  CONSTRAINT `fk_MOVIE_CATEGORY1`
    FOREIGN KEY (`id_category`)
    REFERENCES `ciger`.`CATEGORY` (`idCategory`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ciger`.`CAST`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ciger`.`CAST` (
  `idCast` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `role` VARCHAR(45) NOT NULL,
  `biographyURL` VARCHAR(45) NOT NULL,
  `date_created` DATETIME NOT NULL,
  `date_updated` DATETIME NOT NULL,
  `status` SMALLINT NOT NULL,
  PRIMARY KEY (`idCast`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ciger`.`SALE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ciger`.`SALE` (
  `idSale` INT NOT NULL AUTO_INCREMENT,
  `total` DECIMAL NOT NULL,
  `date_sold` DATETIME NOT NULL,
  `id_person` INT NOT NULL,
  `id_movie` INT NOT NULL,
  PRIMARY KEY (`idSale`),
  INDEX `fk_SALE_PERSON1_idx` (`id_person` ASC) ,
  INDEX `fk_SALE_MOVIE1_idx` (`id_movie` ASC) ,
  CONSTRAINT `fk_SALE_PERSON1`
    FOREIGN KEY (`id_person`)
    REFERENCES `ciger`.`PERSON` (`idPerson`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_SALE_MOVIE1`
    FOREIGN KEY (`id_movie`)
    REFERENCES `ciger`.`MOVIE` (`idMovie`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ciger`.`MOVIE_has_CAST`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ciger`.`MOVIE_has_CAST` (
  `id_movie` INT NOT NULL,
  `id_cast` INT NOT NULL,
  PRIMARY KEY (`id_movie`, `id_cast`),
  INDEX `fk_MOVIE_has_CAST_CAST1_idx` (`id_cast` ASC) ,
  INDEX `fk_MOVIE_has_CAST_MOVIE1_idx` (`id_movie` ASC) ,
  CONSTRAINT `fk_MOVIE_has_CAST_MOVIE1`
    FOREIGN KEY (`id_movie`)
    REFERENCES `ciger`.`MOVIE` (`idMovie`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_MOVIE_has_CAST_CAST1`
    FOREIGN KEY (`id_cast`)
    REFERENCES `ciger`.`CAST` (`idCast`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`TOKEN`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ciger`.`TOKEN` (
  `idToken` INT NOT NULL AUTO_INCREMENT,
  `token` VARCHAR(45) NOT NULL,
  `idUser` INT NOT NULL,
  PRIMARY KEY (`idToken`),
  INDEX `fk_TOKEN_USER1_idx` (`idUser` ASC),
  CONSTRAINT `fk_TOKEN_USER1`
    FOREIGN KEY (`idUser`)
    REFERENCES `ciger`.`USER` (`idUser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
