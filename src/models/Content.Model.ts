import mongoose, { Document, model, Schema, Types } from "mongoose";

export interface IContent extends Document {
  type: "document" | "tweet" | "youtube" | "link";
  link: string;
  title: string;
  tags: string[];
  userId: Types.ObjectId;
  //author: string;
}

const ContentSchema = new Schema<IContent>(
  {
    type: {
      type: String,
      enum: ["document", "tweet", "youtube", "link"],
      required: true,
    },
    link: { type: String, required: true },
    title: { type: String, required: true },
    tags: { type: [String], required: true, default: [] },
    userId: { type: Schema.Types.ObjectId, required: true },
    //author: { type: String },
  },
  { timestamps: true }
);

export const ContentModel = model<IContent>("Content", ContentSchema);
