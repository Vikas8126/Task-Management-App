import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  _id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    color: {
      type: String,
      required: [true, 'Project color is required'],
      match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color'],
      default: '#3B82F6',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
ProjectSchema.index({ name: 1 });
ProjectSchema.index({ createdAt: -1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
