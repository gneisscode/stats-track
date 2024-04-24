import mongoose, { ObjectId } from "mongoose";
const { Schema, Document, model } = mongoose;

export interface StatDocument extends Document {
  _id: ObjectId;
  schoolId: ObjectId;
  presenterId: ObjectId;
  schoolName: string;
  presenterFirstName: string;
  presenterLastName: string;
  presenterUserName: string;
  presenterProvince?: string;
  // seminarId: ObjectId;
  seminarName: string;
  grade: number;
  total: number;
  rec: number;
  tws: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date | null;
}

const statSchema = new Schema<StatDocument>({
  presenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  presenterFirstName: { type: String },
  presenterLastName: { type: String },
  presenterUserName: { type: String },
  seminarName: { type: String },
  presenterProvince: { type: String },
  schoolName: { type: String },
  grade: { type: Number, required: true },
  total: { type: Number, required: true },
  rec: { type: Number, required: true },
  tws: { type: Number, required: true },
  feedback: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Stat = model<StatDocument>("Stat", statSchema);
export default Stat;
