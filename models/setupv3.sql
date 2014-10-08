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
  api_key VARCHAR(45) NOT NULL UNIQUE,
  secret VARCHAR(45) NOT NULL,
  oauth_timestamp VARCHAR(45) NOT NULL,
  oauth_nonce VARCHAR(45) NOT NULL,
  oauth_token: VARCHAR(45) NULL,
  oauth_token_secret: VARCHAR(45) NULL,
  flickrUsername VARCHAR(45) NULL,
  idUser INT NOT NULL,
  PRIMARY KEY (idUser, apiKey)
);

/* Additional constraints for Nodes (application level):
* Parent is null if node is in root
* Only nodes with isDirectory == 1 can be parents
* Both parent and node must have same owner
* Name field is unique for all entries of given idParent
* Entry in files required if and only if isDirectory == 0
*/

DROP TABLE IF EXISTS Nodes;
CREATE TABLE IF NOT EXISTS Nodes (
  idNode INT NOT NULL AUTO_INCREMENT,
  idParent INT NULL,
  idOwner INT NOT NULL,
  name VARCHAR(45) NOT NULL,
  isDirectory BIT NOT NULL,
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

# Insert some shit

# Add user
INSERT INTO Users(email, passwordHash)
VALUES ('wing@xhao.com', 'fuckmeright');

# Add directorys
INSERT INTO Nodes(idOwner, idParent, name, isDirectory)
VALUES (1, null, 'kittyporn', 1);
INSERT INTO Nodes(idOwner, idParent, name, isDirectory)
VALUES (1, 1, 'youtouchmytail', 1);

# Add file
INSERT INTO Nodes(idOwner, idParent, name, isDirectory)
VALUES(1, 2, 'meeowwwch', 0);
INSERT INTO Files(idNode, extension, bytes)
VALUES(3, 'txt', 529);

# Some useful select queries


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