CREATE TABLE Bookings (
  BookingID varchar PRIMARY KEY,
  user_id varchar(200) REFERENCES users(user_id),
  TourID varchar(300) REFERENCES Tours(TourID),
  Date DATE NOT NULL,
  
  
);
