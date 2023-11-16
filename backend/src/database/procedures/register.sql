CREATE OR ALTER PROCEDURE registerUser(
    @user_id VARCHAR(200),
    @fullname VARCHAR(200),
    @email VARCHAR(200),
    @password VARCHAR(200)
)
AS
BEGIN

    INSERT INTO users(user_id, fullname, email, password)
    VALUES(@user_id, @fullname, @email, @password)

END