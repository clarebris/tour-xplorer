




CREATE  TABLE users (
	_id varchar(100) NOT NULL PRIMARY KEY,
	fullName varchar(100) NOT NULL,	
	email varchar(250) NOT NULL,
	imageUrl varchar(250),	
	isDeleted BIT Default 0,
	isAdmin Bit Default 0,
	resetPassword Bit default 0,
	justRegistered bit default 1,
	password varchar(250) NOT NULL,
    
)

DROP TABLE users




select * from users where isAdmin = 1

update users set isAdmin = 1 where email = 'clarebris@gmail.com'
