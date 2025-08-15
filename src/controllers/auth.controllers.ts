import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/Users.js";

export const signup = async (req: express.Request, res: express.Response) => {
  try {
    const { username, email, password } = req.body;

    const existsEmail = await UserModel.findOne({ email });
    const existsUsername = await UserModel.findOne({ username });

    if (existsEmail && existsUsername) {
      return res
        .status(400)
        .json({ message: "Email and Username Both Already Exists!" });
    }
    if (existsEmail) {
      return res.status(400).json({ message: "Email Already Exists!" });
    }
    if (existsUsername) {
      return res.status(400).json({ message: "Username Already Exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const signin = async (req: express.Request, res: express.Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username && !email) {
      return res
        .status(400)
        .json({ message: "Username or Email is required!" });
    }

    const user = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
