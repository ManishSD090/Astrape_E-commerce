import mongoose from 'mongoose';

// This sub-schema defines the structure of each item within the cart
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  image: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
  },
  originalPrice: {
    type: Number,
  }
});

// This is the main schema for the cart itself
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Each user can only have one cart
  },
  items: [cartItemSchema], // An array of items based on the schema above
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;

