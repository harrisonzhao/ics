USE infcsAlQ0HlL9eeC;

DROP TABLE IF EXISTS Users;
CREATE TABLE IF NOT EXISTS Users (
  userId INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(45) NOT NULL UNIQUE,
  passwordHash VARCHAR(60) NOT NULL,
  PRIMARY KEY (userId)
);

DROP TABLE IF EXISTS FlickrAccounts;
CREATE TABLE IF NOT EXISTS FlickrAccounts (
  apiKey VARCHAR(45) NOT NULL UNIQUE,
  apiSecret VARCHAR(45) NOT NULL,
  oAuthToken VARCHAR(45) NULL,
  oAuthSecret VARCHAR(45) NULL,
  flickrUsername VARCHAR(45) NULL, #don't know if necessary
  userId INT NOT NULL,
  PRIMARY KEY (apiKey)
);