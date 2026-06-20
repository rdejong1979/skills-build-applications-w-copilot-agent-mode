import mongoose, { Document, Schema } from 'mongoose';

export interface ILeaderboard extends Document {
  user: mongoose.Types.ObjectId;
  score: number;
  rank?: number;
  period: string;
  updatedAt: Date;
}

const LeaderboardSchema = new Schema<ILeaderboard>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, default: 0 },
  rank: Number,
  period: { type: String, default: 'monthly' },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<ILeaderboard>('Leaderboard', LeaderboardSchema);
