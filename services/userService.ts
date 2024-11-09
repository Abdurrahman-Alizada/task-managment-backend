import generateToken from "../utils/generateToken";
import generateResetToken from "../utils/generateResetToken";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import NodeCache from "node-cache";
import { UserModel } from "../models/user/userModel";
const fs = require("fs");
const path = require("path");
const configFilePath = path.join(__dirname, "../config/config.json");
const tempStorage = new NodeCache();

interface createUserInterface {
  username: string;
  email: string;
  password: string;
  userType: string;
}
interface loginAdminInterface {
  email: string;
  password: string;
}
interface forgotPassInterface {
  email: string;
}
interface verifyForgotPassTokenInterface {
  token: string;
}
interface VerifyTokenResult {
  success: boolean;
  message: string;
}
interface resetPassInterface {
  email: string;
  password: string;
}
interface emailVerifInterface {
  token: string;
}
interface registerAdminInterface {
  userId: string;
}
interface getCustomerByIdInterface {
  id: string;
}
interface deleteCustomerInterface {
  id: string;
}
const createUser = async ({
  username,
  email,
  password,
  userType,
}: createUserInterface) => {
  try {
    const user = await UserModel.findOne({ email });

    if (user) {
      return {
        success: false,
        message: "User already exists with the same email",
      };
    }

    // Generate a reset token
    const resetToken = await generateResetToken({
      email: email,
      role: "user",
      userType: "freeflexer",
    });
    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mabbask440@gmail.com",
        pass: `${process.env.APP_PASSWORD}`,
      },
    });

    // Compose the email
    const mailOptions = {
      from: `${process.env.FROM}`,
      to: email,
      subject: "Email Verification",
      text: `Click the following link for email verification: http://localhost:4000/verifcation/${resetToken}`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent: " + info.response);

    const userId = uuidv4();

    let userDataArray = [];
    if (fs.existsSync(configFilePath)) {
      const configData = fs.readFileSync(configFilePath);
      if (configData) {
        userDataArray = JSON.parse(configData);
      }
    }

    userDataArray.push({ userId, username, email, password, userType });

    // Write the updated user information back to config.json
    fs.writeFileSync(configFilePath, JSON.stringify(userDataArray, null, 2));

    return {
      success: true,
      userId,
      message: "Check your Gmail for email verification",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "User registration internal server error",
    };
  }
};

const emailVerif = ({
  token,
}: emailVerifInterface): Promise<VerifyTokenResult> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, `${process.env.SECRETKEY}`, (err) => {
      if (err) {
        reject({ success: false });
      } else {
        resolve({ success: true, message: "Email verified" });
      }
    });
  });
};

const registerUser = async ({ userId }: registerAdminInterface) => {
  try {
    // Read user data from config.json
    const configData = fs.readFileSync(configFilePath);
    const userDataArray = JSON.parse(configData);

    // Find user information by userId
    const userData = userDataArray.find((user: any) => user.userId === userId);

    if (!userData) {
      return { success: false, message: "Invalid data in config.json" };
    }
    // console.log('The admin registration data in the config.json:', userData);

    const existingAdmin = await UserModel.findOne({ email: userData.email });

    if (existingAdmin) {
      return {
        success: false,
        message: "User already register",
      };
    }

    const register_user = await UserModel.create({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.userType,
    });

    // Remove the registered admin from adminDataArray
    let adminDataArray = userDataArray.filter(
      (user: any) => user.userId !== userId
    );

    // Write the updated adminDataArray back to config.json
    fs.writeFileSync(configFilePath, JSON.stringify(adminDataArray, null, 2));
    const { password, ...registerUser } = register_user.toObject();
    return {
      success: true,
      message: "User Register successfully",
      registerUser,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Registration internal server error" };
  }
};


const forgotPass = async ({ email }: forgotPassInterface) => {
  try {
    // Generate a reset token
    const resetToken = await generateResetToken({
      email: email,
      userType: "freeflexer",
      role: "user",
    });

    if (!resetToken) {
      return { success: false, message: "Error generating reset token" };
    }

    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mabbask440@gmail.com",
        pass: `${process.env.APP_PASSWORD}`,
      },
    });

    // Compose the email
    const mailOptions = {
      from: `${process.env.FROM}`,
      to: email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: http://localhost:4000/password/${resetToken}`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent: " + info.response);

    return { success: true, message: "Reset link sent to your email" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Forgot pass internal server error" };
  }
};

const verifyForgotPassToken = ({
  token,
}: verifyForgotPassTokenInterface): Promise<VerifyTokenResult> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, `${process.env.SECRETKEY}`, (err) => {
      if (err) {
        reject({ success: false, message: "Invalid or expired token" });
      } else {
        resolve({ success: true, message: "Token verified successfully" });
      }
    });
  });
};


export {
  createUser,
  forgotPass,
  verifyForgotPassToken,
  emailVerif,
  registerUser,
};
