import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LinkModel, UserModel } from "../models/Users.js";
import { ContentModel } from "../models/Content.Model.js";
import { random } from "../utils.js";

// Extend Express Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// Signup Route
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

// Signin Route
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

// Add Content Route
export const addContent = async (
  req: express.Request & { userId?: string }, // extend type to include userId
  res: express.Response
) => {
  try {
    const { link, type, title } = req.body;

    const userId = req.userId;

    const newContent = await ContentModel.create({
      type,
      link,
      title,
      tags: [],
      userId: userId, // comes fron user Middleware
    });

    res.json({
      message: "Content Added!",
    });
  } catch (error) {
    console.error("Error adding content:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's Content Route
export const showContent = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = req.userId;
    const content = await ContentModel.find({
      userId: userId,
    }).populate("userId", "username");

    res.json({
      content,
    });
  } catch (error) {
    res.json({
      message: "Something went Wrong!",
    });
  }
};

//Delete Content Route
export const deleteContent = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const contentId = req.body.contentId;

    await ContentModel.deleteMany({
      contentId,
      userId: req.userId,
    });
    res.json({
      message: "Deleted!",
    });
  } catch (error) {
    res.json({ message: "Opps! Something went wrong while deleting!" });
  }
};

// Share Brain Route
export const brainShare = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const share = req.body.share;

    if (share) {
      // Check if link already exists
      const existingLink = await LinkModel.findOne({
        userId: req.userId,
      });

      if (existingLink) {
        res.json({
          hash: existingLink.hash,
        });
      }

      // Create A New Hash
      await LinkModel.create({
        userId: req.userId,
        hash: random(10),
      });
      const hashCreated = await LinkModel.findOne({ userId: req.userId });
      return res.status(200).json({
        hash: hashCreated?.hash,
      });
    } // Else deleting the existing hash
    else {
      await LinkModel.deleteOne({ userId: req.userId });
    }
    return res.json({
      message: "Upadated Link for Brain Share!",
    });
  } catch (error) {
    return res.json({ error });
  }
};

// Share Link
export const shareLink = async (
  req: express.Request,
  res: express.Response
) => {
  const hash = req.params.shareLink;

  // console.log("req.params:", req.params);
  // console.log("Searching hash:", hash);

  // Find the link using the provided hash.
  const link = await LinkModel.findOne({ hash });

  // console.log("Found link:", link);

  if (!link) {
    return res.status(411).json({ message: "Sorry! Link Nahi hai!" });
  }

  // Fetch content and user details for the shareable link.
  const content = await ContentModel.find({
    userId: link?.userId,
  });

  const user = await UserModel.find({
    _id: link?.userId,
  });

  if (!user || user.length === 0) {
    return res.status(404).json({
      message: "User Not Found",
    });
  }

  res.json({
    username: user[0]?.username,
    content: content,
  });
};
