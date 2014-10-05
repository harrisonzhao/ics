USE infcs;

DROP TABLE IF EXISTS Users;
CREATE TABLE IF NOT EXISTS Users (
  idUser INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(45) NOT NULL UNIQUE,
  passwordHash VARCHAR(60) NOT NULL,
  PRIMARY KEY (idUser)
);

DROP TABLE IF EXISTS FlickrAccounts;
CREATE TABLE IF NOT EXISTS FlickrAccounts (
  apiKey VARCHAR(45) NOT NULL UNIQUE,
  apiSecret VARCHAR(45) NOT NULL,
  oAuthToken VARCHAR(45) NULL,
  oAuthSecret VARCHAR(45) NULL,
  flickrUsername VARCHAR(45) NULL,
  idUser INT NOT NULL,
  PRIMARY KEY (idUser, apiKey)
);

/* Additional constraints:
* Parent is null if node is in root
* Only nodes with isDirectory 1 can be parents
* Entry in files only exists if isDirectory is 0
*/

DROP TABLE IF EXISTS Nodes;
CREATE TABLE IF NOT EXISTS Nodes (
  idNode INT NOT NULL AUTO_INCREMENT,
  idParent INT NULL,
  idOwner INT NULL,
  isDirectory BIT NOT NULL DEFAULT 1,
  name VARCHAR(45) NOT NULL,
  PRIMARY KEY (idNode)
);

DROP TABLE IF EXISTS Files;
CREATE TABLE IF NOT EXISTS Files (
  idNode INT NOT NULL AUTO_INCREMENT,
  extension VARCHAR(5) NULL,
  bytes INT NOT NULL,
  PRIMARY KEY (idNode)
);

DROP TABLE IF EXISTS Images;
CREATE TABLE IF NOT EXISTS Images (
  idNode INT NOT NULL,
  imgnum INT NOT NULL,
  flickrImg VARCHAR(45) NOT NULL,
  url VARCHAR(100) NOT NULL,
  height INT NOT NULL,
  width INT NOT NULL,
  bytes INT NOT NULL,
  PRIMARY KEY (idNode,imgnum)
);

/*
DROP TABLE IF EXISTS Directorys;
CREATE TABLE IF NOT EXISTS Directorys (
  idNode INT NOT NULL,
  layer INT NOT NULL DEFAULT 1,
  PRIMARY KEY (idNode)
); 
*/

/*
DROP TABLE IF EXISTS Contain;
CREATE TABLE IF NOT EXISTS Contain (
  idChild INT NOT NULL,
  idParent INT NULL,
  idUser INT NOT NULL,
  PRIMARY KEY (idChild)
);
*/