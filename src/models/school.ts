import mongoose, { ObjectId } from "mongoose";
const { Schema, Document, model } = mongoose;

export interface SchoolDocument extends Document {
  _id: ObjectId;
  stats?: ObjectId[];
  name: string;
  province?: string;
  sessions?: Number;
  createdAt: Date;
  updatedAt: Date | null;
}

const schoolSchema = new Schema<SchoolDocument>({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  province: { type: String, default: null },
  sessions: { type: Number, default: 0 },
  stats: [{ type: Schema.Types.ObjectId, ref: "Stat" }],
});


const School = model<SchoolDocument>("School", schoolSchema);
export default School;

//To-Do
//add relationship for presenters array
