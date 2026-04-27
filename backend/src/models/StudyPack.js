import mongoose from 'mongoose';

const studyPackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    input: {
      field: {
        type: String,
        required: true,
      },
      level: {
        type: String,
        required: true,
      },
      goal: {
        type: String,
        required: true,
        enum: ['exam', 'project', 'revision', 'learning'],
      },
      studyStyle: {
        type: String,
        required: true,
        enum: ['organized', 'last-minute', 'visual', 'minimal'],
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
      items: [
        {
          name: String,
          category: String,
          price: Number,
          reason: String,
        },
      ],
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
