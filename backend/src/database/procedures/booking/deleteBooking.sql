CREATE OR ALTER  PROCEDURE deleteBooking
	@booking_id varchar(100)
as

set nocount on;

begin
	UPDATE dbo.bookings
	SET isDeleted = 1
	
	WHERE booking_id = @booking_id;
end;