USE infcsAlQ0HlL9eeC;

DROP TABLE IF EXISTS Users;
CREATE TABLE IF NOT EXISTS Users (
  idUser INT NOT NULL AUTO_INCREMENT,
  flickrID VARCHAR(45) NOT NULL UNIQUE,
  oauth VARCHAR(45) NULL,
  secret VARCHAR(45) NULL,
  PRIMARY KEY (idUser)
);

INSERT INTO Users (flickrID,oauth,secret)
VALUES ('abc', '1234', '123456');

DROP TABLE IF EXISTS Files;
CREATE TABLE IF NOT EXISTS Files (
  idUser INT NOT NULL,
  direct VARCHAR(45) NULL,
  filename VARCHAR(45) NOT NULL,
  isDirectory BIT NOT NULL,
  idFile INT NOT NULL UNIQUE AUTO_INCREMENT,
  extension VARCHAR(5) NULL,
  size INT NULL,
  PRIMARY KEY (idUser,direct,filename)
);

INSERT INTO Files (idUser,filename,isDirectory)
VALUES (1,'afolder',1);

DROP TABLE IF EXISTS Parts;
CREATE TABLE IF NOT EXISTS Parts (
  fidOwner INT NOT NULL,
  imgnum INT NOT NULL,
  flickrImg VARCHAR(45) NOT NULL,
  url VARCHAR(100) NOT NULL,
  length INT NOT NULL,
  width INT NOT NULL,
  bytes INT NOT NULL,
  PRIMARY KEY (fidOwner,imgnum)
);