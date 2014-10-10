USE infcs;

DROP TABLE IF EXISTS Users;
CREATE TABLE IF NOT EXISTS Users (
  idUser INT NOT NULL AUTO_INCREMENT,
  apiKey VARCHAR(45) NOT NULL,
  apiKeySecret VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL UNIQUE,
  passwordHash VARCHAR(60) NOT NULL,
  PRIMARY KEY (idUser)
);

#for now only support everyone using our api key
#access tokens are unique and never expire
#select best access token when inserting based on bytes used
#for now only support 1 flickr account per user i guess
DROP TABLE IF EXISTS FlickrAccounts;
CREATE TABLE IF NOT EXISTS FlickrAccounts (
  accessToken VARCHAR(45) UNIQUE NOT NULL,
  accessTokenSecret VARCHAR(45) NOT NULL,
  bytesUsed BIGINT UNSIGNED DEFAULT 0,
  idUser INT NOT NULL,
  PRIMARY KEY (accessToken)
);
ALTER TABLE FlickrAccounts ADD INDEX(idUser);

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
  isDirectory BIT NOT NULL,
  name VARCHAR(45) NOT NULL,
  PRIMARY KEY (idNode)
);

DROP TABLE IF EXISTS Files;
CREATE TABLE IF NOT EXISTS Files (
  idNode INT NOT NULL AUTO_INCREMENT,
  extension VARCHAR(5) NULL,
  totalBytes INT NOT NULL,
  PRIMARY KEY (idNode)
);

#bytes is bytes that the png image takes up
DROP TABLE IF EXISTS Images;
CREATE TABLE IF NOT EXISTS Images (
  idNode INT NOT NULL,
  imgNum INT NOT NULL,
  idImg VARCHAR(45) NOT NULL,
  height INT NOT NULL,
  width INT NOT NULL,
  bytes INT NOT NULL,
  accessToken VARCHAR(45) NOT NULL,
  PRIMARY KEY (idNode,imgnum)
);

DROP TRIGGER IF EXISTS BeforeImageInsert;
DELIMITER $$
CREATE TRIGGER BeforeImageInsert BEFORE INSERT ON Images
  FOR EACH ROW 
  BEGIN
    UPDATE FlickrAccounts 
    SET bytesUsed = bytesUsed + NEW.bytes
    WHERE accessToken = NEW.accessToken;
  END;
$$
DELIMITER ;

DROP TRIGGER IF EXISTS BeforeImageDelete;
DELIMITER $$
CREATE TRIGGER BeforeImageDelete BEFORE DELETE ON Images
  FOR EACH ROW 
  BEGIN
    UPDATE FlickrAccounts 
    SET bytesUsed = bytesUsed - OLD.bytes
    WHERE accessToken = OLD.accessToken;
  END;
$$
DELIMITER ;

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
INSERT INTO Files(idNode, extension, totalBytes)
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