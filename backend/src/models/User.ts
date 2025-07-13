import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'User' | 'Organizer' | 'Admin';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['User', 'Organizer', 'Admin'], default: 'User' },
});

export default mongoose.model<IUser>('User', UserSchema);
