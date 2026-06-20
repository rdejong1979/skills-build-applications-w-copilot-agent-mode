import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  user: mongoose.Types.ObjectId;
  type: string;
  duration: number;
  distance?: number;
  calories?: number;
  notes?: string;
  date: Date;
}

const ActivitySchema = new Schema<IActivity>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true, enum: ['running', 'walking', 'cycling', 'swimming', 'strength', 'yoga', 'other'] },
  duration: { type: Number, required: true },
  distance: Number,
  calories: Number,
  notes: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IActivity>('Activity', ActivitySchema);
