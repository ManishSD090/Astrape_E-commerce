import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide item name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide item description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide item price'],
      min: [0, 'Price must be a positive number'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price must be positive'],
    },
    category: {
      type: String,
      required: [true, 'Please provide item category'],
    },
    brand: {
      type: String,
      required: [true, 'Please provide brand'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
  },
  { timestamps: true }
);

const Item = mongoose.model('Item', itemSchema);

export default Item;
