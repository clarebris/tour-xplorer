CREATE TABLE users(
    user_id varchar(200) PRIMARY KEY,
    email varchar(200) NOT NULL UNIQUE,
    password varchar(200) NOT NULL,
    fullname varchar(200) NOT NULL,
    role VARCHAR(20) Default 'user',
    activate BIT

)