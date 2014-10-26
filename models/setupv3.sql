USE infcs;

#using VARCHARS because lazy testing can't type out 32 char

DROP TABLE IF EXISTS Users;
CREATE TABLE IF NOT EXISTS Users (
  idUser INT NOT NULL AUTO_INCREMENT,
  apiKey VARCHAR(45) NOT NULL,        #length is exactly 32
  apiKeySecret VARCHAR(16) NOT NULL,  #length is exactly 16
  email VARCHAR(254) NOT NULL UNIQUE, #max email length is 254 chars
  firstName VARCHAR(45) NOT NULL,
  lastName VARCHAR(45) NOT NULL,
  passwordHash VARCHAR(60) NOT NULL,
  PRIMARY KEY (idUser)
);

#for now only support everyone using our api key
#access tokens are unique and never expire
#select best access token when inserting based on bytes used
#for now only support 1 flickr account per user i guess
DROP TABLE IF EXISTS FlickrAccounts;
CREATE TABLE IF NOT EXISTS FlickrAccounts (
  accessToken VARCHAR(34) UNIQUE NOT NULL,  #length is exactly 34
  accessTokenSecret VARCHAR(16) NOT NULL,   #length is exactly 16
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
  idNode INT NOT NULL,
  extension VARCHAR(5) NULL,
  totalBytes BIGINT NOT NULL, #the bytes taken up by the file, could be big
  PRIMARY KEY (idNode)
);

#bytes is bytes that the png image takes up
DROP TABLE IF EXISTS Images;
CREATE TABLE IF NOT EXISTS Images (
  idNode INT NOT NULL,
  imgNum INT NOT NULL,
  idImg VARCHAR(45) UNIQUE NOT NULL,
  height INT NOT NULL,
  width INT NOT NULL,
  bytes INT NOT NULL, #the bytes taken up by the png, max 200 * 10^6
  accessToken VARCHAR(34) NOT NULL, #foreign key from FlickrAccounts
  PRIMARY KEY (idNode, imgnum)
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
INSERT INTO Users(apiKey, apiKeySecret, email, passwordHash)
VALUES ('a', 'b', 'wing@xhao.com', 'pw');

# Add directorys
INSERT INTO Nodes(idOwner, idParent, name, isDirectory)
VALUES (1, null, 'wat', 1);
INSERT INTO Nodes(idOwner, idParent, name, isDirectory)
VALUES (1, 1, 'the', 1);

# Add file
START TRANSACTION;

INSERT INTO Nodes(idOwner, idParent, name, isDirectory)
VALUES(1, 2, 'fuck', 0);

INSERT INTO Files(idNode, extension, totalBytes)
VALUES((SELECT idNode FROM Nodes ORDER BY idNode DESC LIMIT 1), 'dave', 529);

COMMIT;

INSERT INTO FlickrAccounts (accessToken, accessTokenSecret, idUser) VALUES ('a', 'b', 1);

INSERT INTO Images(idNode, imgNum, idImg, height, width, bytes, accessToken) 
           VALUES (3, 1, '123', 10, 11, 100, 'a');
           
# Some useful select queries

# Get all images for a file.
SELECT *
FROM Images
WHERE idNode = 3;

# Get all files/directories in a directory
SELECT *
FROM Nodes
WHERE idParent = 1;

