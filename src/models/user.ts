import mongoose, {ObjectId} from "mongoose";
const { Schema, Document, model } = mongoose;

export interface UserDocument extends Document {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  averageRec: number;
  averageTWS: number;
  sessions: number;
  province: string;
  teamLead: string;
  organisation: string;
  createdAt: Date;
  updatedAt: Date | null;
  resetToken?: string;
  tokenExpiration?: Date;
}

const userSchema = new Schema<UserDocument>({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  organisation: { type: String, default: null },
  averageRec: { type: Number, default: 0 },
  averageTWS: { type: Number, default: 0 },
  sessions: { type: Number, default: 0 },
  province: { type: String, default: null },
  teamLead: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resetToken: { type: String },
  tokenExpiration: { type: Date },
});

const User = model<UserDocument>("User", userSchema)
export default User

//To Do
//Add province and team lead