import mongoose from 'mongoose';

const studyPackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    input: {
      field: {
        type: String,
        required: true,
        enum: ['Computer Science', 'Engineering', 'Medicine', 'Business', 'Law', 'Arts'],
      },
      level: {
        type: String,
        required: true,
        enum: ['L1', 'L2', 'L3', 'Master'],
      },
      goal: {
        type: String,
        required: true,
        enum: ['Exams', 'Projects', 'Revision', 'Internship'],
      },
      studyStyle: {
        type: String,
        required: true,
        enum: ['Organized', 'Last-minute', 'Visual learner', 'Minimalist'],
      },
      budget: {
        type: Number,
        required: true,
        min: [0, 'Budget cannot be negative'],
      },
    },
    generatedPack: {
      packName: String,
      description: String,
      totalEstimatedCost: Number,
      currency: {
        type: String,
        default: 'DT',
      },
      items: [
        {
          name: String,
          category: String,
          price: Number,
          reason: String,
        },
      ],
    },
    savedDate: {
      type: Date,
      default: Date.now,
    },
    tokensSaved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('StudyPack', studyPackSchema);
