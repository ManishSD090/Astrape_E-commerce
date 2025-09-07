import Cart from '../models/Cart.js';
import Item from '../models/Item.js';

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ items: [] });

    res.json({ items: cart.items });
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching cart.' });
  }
};

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  console.log('--- Add to Cart Request ---');
  console.log('User:', req.user?._id);
  console.log('Product ID:', productId);
  console.log('Quantity:', quantity);

  // Ensure quantity is a valid number
  const qty = Number(quantity);
  if (isNaN(qty) || qty < 1) {
    return res.status(400).json({ message: 'Invalid quantity. Must be a number greater than 0.' });
  }

  try {
    // Check if the product exists
    const item = await Item.findById(productId);
    console.log('Item found:', item);

    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    // Find user's cart or create a new one
    let cart = await Cart.findOne({ user: req.user._id });
    console.log('Current cart:', cart);

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      console.log('Created new cart');
    }

    // Check if the item already exists in the cart
    const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);
    console.log('Item index in cart:', itemIndex);

    if (itemIndex > -1) {
      // Item exists, update quantity
      cart.items[itemIndex].quantity += qty;
    } else {
      // Add new item
      cart.items.push({
      productId,
      quantity: qty,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.imageUrl, // ← fix here
      brand: item.brand,
    });
    }

    // Save the cart
    const updatedCart = await cart.save();
    console.log('Updated cart saved:', updatedCart);
    res.status(200).json(updatedCart);

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server Error adding to cart.' });
  }
};


// ✅ Add this function
export const updateCartItemQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const qty = Number(quantity);

  if (isNaN(qty) || qty < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1.' });
  }

  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found.' });

    const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = qty;
      const updatedCart = await cart.save();
      res.status(200).json(updatedCart);
    } else {
      res.status(404).json({ message: 'Item not found in cart.' });
    }
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Server Error updating cart item.' });
  }
};

export const removeCartItem = async (req, res) => {
  const { productId } = req.params;

  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found.' });

    cart.items = cart.items.filter(p => p.productId.toString() !== productId);
    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ message: 'Server Error removing from cart.' });
  }
};
