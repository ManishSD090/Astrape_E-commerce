import express from 'express';
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} from '../controllers/itemController.js';

const router = express.Router();

// @desc    Create a new item
// @route   POST /api/items
// @access  Admin
router.post('/', createItem);

// @desc    Get all items
// @route   GET /api/items
// @access  Public
router.get('/', getItems);

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
router.get('/:id', getItemById);

// @desc    Update item by ID
// @route   PUT /api/items/:id
// @access  Admin
router.put('/:id', updateItem);

// @desc    Delete item by ID
// @route   DELETE /api/items/:id
// @access  Admin
router.delete('/:id', deleteItem);

export default router;
