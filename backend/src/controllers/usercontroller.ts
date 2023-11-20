// import { Request, Response } from "express";
// import mssql from "mssql";
// import bcrypt from "bcrypt";

// import jwt from "jsonwebtoken";
// import { v4 } from "uuid";
// import { sqlConfig } from "../config/sqlConfig";
// import {
//   userLoginValidationSchema,
//   userRegisterValidationSchema,
// } from "../validators/userValidators";
// import { ExtendedUser } from "../middleware/tokenVerify";

// //register user
// export const registerUser = async (req: Request, res: Response) => {
//   try {
//     let { userName, email, password, phone_no } = req.body;

//     const { error } = userRegisterValidationSchema.validate(req.body);

//     if (error) {
//       return res.status(400).json({ error: error.details[0].message });
//     }

//     let userID = v4();
//     const hashedPwd = await bcrypt.hash(password, 5);

//     const pool = await mssql.connect(sqlConfig);

//     const checkEmailQuery = `SELECT 1 FROM Users WHERE email = @email`;
//     const emailCheckResult = await pool
//       .request()
//       .input("email", mssql.VarChar, email)
//       .query(checkEmailQuery);

//     const checkPhoneQuery = `SELECT 1 FROM Users WHERE phone_no = @phone_no`;
//     const phoneCheckResult = await pool
//       .request()
//       .input("phone_no", mssql.VarChar, phone_no)
//       .query(checkPhoneQuery);

//     if (
//       emailCheckResult.recordset.length > 0 &&
//       phoneCheckResult.recordset.length > 0
//     ) {
//       return res
//         .status(400)
//         .json({ error: "Email and phone number already exist." });
//     } else if (emailCheckResult.recordset.length > 0) {
//       return res.status(400).json({ error: "Email already exists" });
//     } else if (phoneCheckResult.recordset.length > 0) {
//       return res.status(400).json({ error: "Phone number already exists." });
//     }

//     const data = await pool
//       .request()
//       .input("userID", mssql.VarChar, userID)
//       .input("userName", mssql.VarChar, userName)
//       .input("email", mssql.VarChar, email)
//       .input("phone_no", mssql.VarChar, phone_no)
//       .input("password", mssql.VarChar, hashedPwd)
//       .execute("registerUser");

//     return res.status(200).json({
//       message: "User registered successfully",
//     });
//   } catch (error) {
//     return res.json({
//       error: error,
//     });
//   }
// };

// //login user
// export const loginUser = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     const { error } = userLoginValidationSchema.validate(req.body);

//     if (error) {
//       return res.status(400).json({ error: error.details[0].message });
//     }

//     const pool = await mssql.connect(sqlConfig);

//     let user = await (
//       await pool
//         .request()
//         .input("email", mssql.VarChar, email)
//         .input("password", mssql.VarChar, password)
//         .execute("loginUser")
//     ).recordset;

//     if (user.length === 1) {
//       const correctPwd = await bcrypt.compare(password, user[0].password);

//       if (!correctPwd) {
//         return res.status(401).json({
//           error: "Incorrect password",
//         });
//       }
//       const loginCredentials = user.map((record) => {
//         const { phone_no, id_no, password, ...rest } = record;
//         return rest;
//       });

//       const token = jwt.sign(
//         loginCredentials[0],
//         process.env.SECRET as string,
//         {
//           expiresIn: "3600s",
//         }
//       );

//       return res.status(200).json({
//         message: "Logged in successfully",
//         token,
//       });
//     } else {
//       return res.status(401).json({
//         error: "Email not found",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       error: "Internal Server Error",
//     });
//   }
// };

// //checkUser Details
// export const checkUserDetails = async (req: ExtendedUser, res: Response) => {
//   if (req.info) {
//     return res.json({
//       info: req.info,
//     });
//   }
// };

// // sendReview
// export const sendReview = async (req: Request, res: Response) => {
//   let { email, review } = req.body;

//   try {
//     const pool = await mssql.connect(sqlConfig);

//     // Execute the stored procedure without checking if the user exists
//     await pool
//       .request()
//       .input("email", mssql.VarChar, email)
//       .input("review", mssql.VarChar, review)
//       .execute("sendReview");

//     // Assuming the procedure execution completes without errors
//     return res.status(200).json({
//       message: "Review updated successfully",
//     });
//   } catch (error) {
//     console.error("Error in sendReview:", error); // Log the detailed error
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

import { Request, Response } from "express";
import { execute, query } from "../services/dbconnect";

 import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { ExtendedUser, updatUser, user } from "../types/userInterfaces";
import { generateToken } from "../services/tokenGenerator";
import {
  validateLoginUser,
  validateRegisterUser,
  validateResetpassword,
  validateUpdateuser,
  validateUserEmail,
  validateuserId,
} from "../validators/userValidator";
import { comparePass, hashPass } from "../services/passwordHash";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const procedureName = "getUsers";
    const result = await query(`EXEC ${procedureName}`);
    return res.json(result.recordset);
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    // console.log(id);
    if (!id) return res.status(400).send({ message: "Id is required" });

    const { error } = validateuserId.validate(req.params);

    if (error)
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });

    const procedureName = "getUserById";
    const result = await execute(procedureName, { id });

    res.json(result.recordset[0]);
  } catch (error) {
    console.log(error);
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { fullName, password, email } = req.body;

    // console.log(email);

    const { error } = validateRegisterUser.validate(req.body);

    if (error)
      return res.status(400).send({
        error:
          "check email or password should be atleast 8 characters long with letters symbols and uppercase",
      });

    const newPassword = await hashPass(password);

    const procedure1 = "getUserByEmail";
    const result = await execute(procedure1, { email });

    const userWithEmail = result.recordset[0];
    console.log(userWithEmail);

    if (userWithEmail)
      return res
        .status(404)
        .send({ error: "Account exists with the given email" });

    const newUser: user = {
      id: uuidv4(),
      fullName,
      email,
      password: newPassword,
    };

    const procedureName = "registerUser";
    const params = newUser;
    // console.log(params);

    await execute(procedureName, params);

    return res.send({ message: "User registered succesfully" });
  } catch (error) {
    console.log(error);
    res.send({ error: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const procedureName = "getUserByEmail";

    const { error } = validateLoginUser.validate(req.body);

    if (error)
      return res.status(400).send({
        success: false,
        error:
          "password should be atleast 8 characters long <br> with letters symbols and uppercase",
      });

    const result = await execute(procedureName, { email });
    if (result) {
      const recordset = result.recordset;
      const user = recordset[0];

      if (!user) {
        return res.status(404).send({ error: "Account does not exist" });
      }

      const validPassword = await comparePass(password, user.password);

      if (!validPassword) {
        return res.status(404).send({ error: "Invalid password" });
      }

      const token = generateToken(
        user.email,
        user._id,
        user.fullName,
        user.isAdmin
      );
      return res.send({
        message: "Logged in successfully",
        token,
      });
    } else {
      return res.status(404).send({ message: "Account does not exist" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id, fullName, email } = req.body;

    const { error } = validateUpdateuser.validate(req.body);
    if (error)
      return res
        .status(400)
        .send({ error: "check full name & email if they are correct" });

    const newUser: updatUser = {
      id,
      fullName,
      email,
    };

    const procedureName = "updateUser";
    const params = newUser;
    // console.log(params);

    await execute(procedureName, params);
    return res.send({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: (error as Error).message,
      message: "Internal Sever Error",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    // console.log(id);
    if (!id) return res.status(400).send({ message: "Id is required" });

    const { error } = validateuserId.validate(req.params);

    if (error) return res.status(400).send({ error: "enter a valid id" });

    const procedureName = "deleteUser";
    await execute(procedureName, { id });

    res.status(201).send({ message: "User deleted Successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).send({ message: "email is required" });

    const { error } = validateUserEmail.validate(req.body);

    if (error) {
      return res.status(400).send({ error: "enter a valid email" });
    }

    const procedure1 = "getUserByEmail";
    const result = await execute(procedure1, { email });

    const userWithEmail = result.recordset[0];

    if (!userWithEmail)
      return res.status(404).send({ error: "Invalid Email Provided " });

    const procedureName = "forgotPassword";
    await execute(procedureName, { id: userWithEmail._id });

    res
      .status(201)
      .send({ message: "check your email for a password reset link" });
  } catch (error) {
    console.log(error);
    res.send({ error: (error as Error).message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { id, password } = req.body;

    if (!id) return res.status(400).send({ message: "id is required" });
    if (!password)
      return res.status(400).send({ message: "password is required" });

    const { error } = validateResetpassword.validate(req.body);

    if (error) {
      return res.status(400).send({
        error:
          "check correct Email or password should be atleast 8 characters long with letters symbols and uppercase",
      });
    }

    const procedure1 = "getUserById";
    const result = await execute(procedure1, { id });

    const userWithId = result.recordset[0];

    if (!userWithId)
      return res
        .status(404)
        .send({ error: "There is no such User with that id" });

    const newPassword = await hashPass(password);

    const params = {
      id: userWithId._id,
      password: newPassword,
    };

    const procedureName = "resetPassword";

    await execute(procedureName, params);

    res.send({ message: "Password Updated succesfully" });
  } catch (error) {
    console.log(error);
    res.send({ error: (error as Error).message });
  }
};

export const checkUserDetails = async (request: any, res: Response) => {
  // console.log("checking details");
  if (request.info) {
    return res.json({
      info: request.info,
    });
  }
};
