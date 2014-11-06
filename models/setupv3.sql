USE infcs;

#using VARCHARS because lazy testing can't type out 32 char

DROP TABLE IF EXISTS Users;
CREATE TABLE IF NOT EXISTS Users (
  idUser INT NOT NULL AUTO_INCREMENT,
  apiKey VARCHAR(45) NOT NULL,        #length is exactly 32
  apiKeySecret VARCHAR(16) NOT NULL,  #length is exactly 16
  email VARCHAR(254) NOT NULL UNIQUE, #max email length is 254 chars
  numAccounts INT NOT NULL DEFAULT 0,
  passwordHash VARCHAR(60) NOT NULL,
  PRIMARY KEY (idUser)
);

#for now only support everyone using our api key
#access tokens are unique and never expire
#select best access token when inserting based on bytes used
#for now only support 1 flickr account per user I guess
DROP TABLE IF EXISTS FlickrAccounts;
CREATE TABLE IF NOT EXISTS FlickrAccounts (
  accessToken VARCHAR(34) UNIQUE NOT NULL,  #length is exactly 34
  accessTokenSecret VARCHAR(16) NOT NULL,   #length is exactly 16
  bytesUsed BIGINT UNSIGNED DEFAULT 0,
  idUser INT NOT NULL,
  PRIMARY KEY (accessToken),
  CHECK(bytesUsed >= 0 AND bytesUsed <= 1000000000000)
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
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (idNode)
);

CREATE INDEX ownerIndx ON Nodes(idOwner) USING BTREE;

DROP TABLE IF EXISTS Files;

#bytes is bytes that the png image takes up
DROP TABLE IF EXISTS Images;
CREATE TABLE IF NOT EXISTS Images (
  idNode INT NOT NULL,
  imgNum INT NOT NULL,
  idImg VARCHAR(45) UNIQUE NOT NULL,
  bytes INT NOT NULL, #the bytes taken up by the png, max 200 * 10^6
  accessToken VARCHAR(34) NOT NULL, #foreign key from FlickrAccounts
  PRIMARY KEY (idNode, imgNum)
);

DROP TRIGGER IF EXISTS BeforeFlickrAccountInsert;
DELIMITER $$
CREATE TRIGGER BeforeFlickrAccountInsert BEFORE INSERT ON FlickrAccounts
  FOR EACH ROW 
  BEGIN
    UPDATE Users
    SET numAccounts = numAccounts + 1
    WHERE idUser = NEW.idUser;
  END;
$$
DELIMITER ;

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
-- INSERT INTO Users(apiKey, apiKeySecret, email, passwordHash)
-- VALUES ('45a330b4bcbe145c9b8a7e53dfe21c56', 'e175d4c4458c0e0f', 'wing@xhao.com', 'pw');

-- INSERT INTO FlickrAccounts(accessToken, accessTokenSecret, bytesUsed, idUser)
-- VALUES ('72157647421924547-33f5e8fee2329c42','d0e63b4b168ed94d',0,1);

# Add directorys
-- INSERT INTO Nodes(idOwner, idParent, name, isDirectory)
-- VALUES (1, null, 'wat', 1);
-- INSERT INTO Nodes(idOwner, idParent, name, isDirectory)
-- VALUES (1, 1, 'the', 1);

# Add file
-- INSERT INTO Nodes(idOwner, idParent, name, isDirectory)
-- VALUES(1, 2, 'fuck', 0);

##

# Add an image
-- INSERT INTO Images(idNode, imgNum, idImg, bytes, accessToken) 
--   VALUES (3, 1, '15685157702', 14101, '72157647421924547-33f5e8fee2329c42');

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

-- select * from Nodes;

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