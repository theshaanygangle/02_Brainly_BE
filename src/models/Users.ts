//create user models and user schema here

import { hash } from "crypto";
import moongoose, { Document, model, Schema } from "mongoose";
import { string } from "zod";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const LinkSchema = new Schema({
  hash: String,
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
});

export const LinkModel = model("Links", LinkSchema);

export const UserModel = model<IUser>("User", UserSchema);
