CREATE DATABASE BookDB;

CREATE TABLE livro (
    idLivro INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
    descricao VARCHAR(100) NOT NULL,
    autor VARCHAR(50) NOT NULL,
    editora VARCHAR(50) NOT NULL,
    categoria VARCHAR(20) NOT NULL,
    ano INT NOT NULL,
    PRIMARY KEY (idLivro)
);