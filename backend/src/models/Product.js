import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required (in DT)'],
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      default: 'DT',
      enum: ['DT'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['stationery', 'electronics', 'books', 'study snacks', 'planners & organization tools', 'digital tools'],
    },
    image: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    tags: [String],
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Product', productSchema);
