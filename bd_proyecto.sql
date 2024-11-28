SET NAMES 'latin1';
DROP DATABASE IF EXISTS registro;
CREATE DATABASE IF NOT EXISTS registro DEFAULT CHARACTER SET utf8;
USE registro;

CREATE TABLE users (
    id INTEGER NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50),         
    apellido_paterno VARCHAR(50), 
    apellido_materno VARCHAR(50), 
    escuela VARCHAR(100),       
    carrera VARCHAR(100),       
    telefono VARCHAR(15),       
    correo VARCHAR(50),         
    PRIMARY KEY(id)
)DEFAULT CHARACTER SET utf8;

