CREATE OR ALTER PROCEDURE login(
    @email VARCHAR(200), @password VARCHAR(200)
    )
AS
BEGIN

    SELECT * FROM users WHERE email= @email

END