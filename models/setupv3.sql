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
  isDirectory BOOL NOT NULL,
  name VARCHAR(45) NOT NULL,
  PRIMARY KEY (idNode)
);

CREATE INDEX ownerIndx ON Nodes(idOwner) USING BTREE;

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

DROP TRIGGER IF EXISTS BeforeNodeDelete;
DELIMITER $$
CREATE TRIGGER BeforeNodeDelete BEFORE DELETE ON Nodes
	FOR EACH ROW
	BEGIN
		DELETE FROM Files
        WHERE idNode = OLD.idNode;
        
        DELETE FROM Images
        WHERE idNode = OLD.idNode;
	END;
$$
DELIMITER ;

# Fail the insert if the name is already in that subdir
DROP TRIGGER IF EXISTS BeforeNodeInsert;
DELIMITER $$
CREATE TRIGGER BeforeNodeInsert BEFORE INSERT ON Nodes
	FOR EACH ROW
	BEGIN
		IF NEW.name IN (
			SELECT name
      FROM Nodes
      WHERE idParent = NEW.idParent
				OR (ISNULL(idParent) AND ISNULL(NEW.idParent) AND idOwner = NEW.idOwner)
		) THEN
			SET NEW.idOwner = NULL;
		END IF;
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
##

# Add an account
INSERT INTO FlickrAccounts (accessToken, accessTokenSecret, idUser) VALUES ('a', 'b', 1);

# Add an image
INSERT INTO Images(idNode, imgNum, idImg, height, width, bytes, accessToken) 
           VALUES (3, 1, '123', 10, 11, 100, 'a');

# Recursively delete a directory
/*
START TRANSACTION;
DELETE FROM Images2;
CALL recursiveDelete(1);
COMMIT;
*/
##
           
# Some useful select queries

#select * from Nodes where idOwner = 1 AND ISNULL(idParent)

select * from Nodes;

/*
# Get all images for a file.
SELECT *
FROM Images
WHERE idNode = 3;

DELETE FROM Nodes
WHERE idNode = 1;

# Get all files/directories in a directory
SELECT *
FROM Nodes
*/