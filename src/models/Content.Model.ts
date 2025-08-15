import mongoose, { Document, model, Schema, Types } from "mongoose";

// export interface IContent extends Document {
//   type: "document" | "tweet" | "youtube" | "link";
//   link: string;
//   title: string;
//   tags: string[];
//   userId: Types.ObjectId;
//   //author: string;
// }

//<IContent>

const ContentSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["document", "tweet", "youtube", "link"],
      required: true,
    },
    link: { type: String, required: true },
    title: { type: String, required: true },
    tags: { type: [String], required: true, default: [] },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    //author: { type: String },
  },
  { timestamps: true }
);

export const ContentModel = model("Content", ContentSchema);
