CREATE TABLE Tours (
  TourID VARCHAR(300) PRIMARY KEY,
  Title VARCHAR(255) NOT NULL,
  Description VARCHAR(300) NOT NULL,
  Destination VARCHAR(255) NOT NULL,
  Duration INT NOT NULL,
  Price INT NOT NULL,
  tourImage VARCHAR(255)
  
);