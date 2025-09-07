import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';  

// Helper function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  const { username, email, password, number } = req.body;

  if (!username || !email || !password || !number) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    // Check if user already exists (by email or phone)
    const existingUser = await User.findOne({
      $or: [{ email }, { number }],
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or phone already exists.' });
    }

    // Create user
    const user = await User.create({ username, email, password, number });

    res.status(201).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        number: user.number,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        number: user.number,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};
