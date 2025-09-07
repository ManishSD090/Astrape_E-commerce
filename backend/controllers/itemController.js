import Item from '../models/Item.js';

/**
 * @desc    Fetch all items with optional filters
 * @route   GET /api/items
 * @access  Public
 */
export const getItems = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, brands, minRating } = req.query;
    let filter = {};

    if (category) filter.category = { $in: category.split(',') };
    if (brands) filter.brand = { $in: brands.split(',') };
    if (minRating) filter.rating = { $gte: Number(minRating) };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const items = await Item.find(filter);
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching items.' });
  }
};

/**
 * @desc    Fetch single item by ID
 * @route   GET /api/items/:id
 * @access  Public
 */
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching item.' });
  }
};

/**
 * @desc    Create a new item
 * @route   POST /api/items
 * @access  Admin
 */
export const createItem = async (req, res) => {
  try {
    const {
      name,
      price,
      imageUrl,    // must match your schema
      category,
      brand,
      description,
      rating,
      reviews,
      originalPrice,
      quantity,
    } = req.body;

    // Validate required fields
    if (!name || !price || !imageUrl || !category || !brand || !description) {
      return res.status(400).json({ message: 'Missing required fields', body: req.body });
    }

    const item = new Item({
      name,
      price,
      originalPrice,
      imageUrl,
      category,
      brand,
      description,
      rating,
      reviews,
      quantity,
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error creating item.' });
  }
};

/**
 * @desc    Update item by ID
 * @route   PUT /api/items/:id
 * @access  Admin
 */
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Item not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating item.' });
  }
};

/**
 * @desc    Delete item by ID
 * @route   DELETE /api/items/:id
 * @access  Admin
 */
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (item) {
      await item.deleteOne();
      res.json({ message: 'Item removed successfully.' });
    } else {
      res.status(404).json({ message: 'Item not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error deleting item.' });
  }
};
