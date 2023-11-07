import mongoose, { ObjectId } from "mongoose";
const { Schema, Document, model } = mongoose;

export interface SchoolDocument extends Document {
  _id: ObjectId;
  name: string;
  sessions?: Number;
  createdAt: Date;
  updatedAt: Date | null;
}

const schoolSchema = new Schema<SchoolDocument>({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  sessions: { type: Number, default: 0 },
});


const School = model<SchoolDocument>("School", schoolSchema);
export default School;


//Add province
//To-Do : create a relationship between schools and presenters
//To-Do : create a relationship between schools and stats??