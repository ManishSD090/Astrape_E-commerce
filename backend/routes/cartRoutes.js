import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js'; // ✅ import protect

const router = express.Router();

// All cart routes should be protected
router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/update/:productId', protect, updateCartItemQuantity);
router.delete('/remove/:productId', protect, removeCartItem);

export default router;
