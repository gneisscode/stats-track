import mongoose, {ObjectId} from "mongoose";
const { Schema, Document, model } = mongoose;

export interface UserDocument extends Document {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  organisation: string;
  createdAt: Date;
  updatedAt: Date | null;
}

const userSchema = new Schema<UserDocument>({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: {type: String},
  organisation: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = model<UserDocument>("User", userSchema)
export default User