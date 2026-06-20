import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkout extends Document {
  title: string;
  description: string;
  fitnessLevel: string;
  exercises: {
    name: string;
    sets?: number;
    reps?: number;
    duration?: number;
  }[];
  estimatedCalories: number;
  createdAt: Date;
}

const WorkoutSchema = new Schema<IWorkout>({
  title: { type: String, required: true },
  description: String,
  fitnessLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  exercises: [
    {
      name: { type: String, required: true },
      sets: Number,
      reps: Number,
      duration: Number,
    },
  ],
  estimatedCalories: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IWorkout>('Workout', WorkoutSchema);
