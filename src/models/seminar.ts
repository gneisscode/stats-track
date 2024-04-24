import mongoose, { ObjectId } from "mongoose";
const { Schema, Document, model } = mongoose;

export interface SeminarDocument extends Document {
  _id: ObjectId;
  name: string;
}

const seminarSchema = new Schema<SeminarDocument>({
  name: { type: String, required: true },
});

const Seminar = model<SeminarDocument>("Seminar", seminarSchema);
export default Seminar;
