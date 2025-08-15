import mongoose, { Document, model, Schema } from "mongoose";

export interface IContent extends Document {
  type: "document" | "tweet" | "youtube" | "link";
  link: string;
  title: string;
  tags: string[];
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
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const ContentModel = model<IContent>("Content", ContentSchema);
