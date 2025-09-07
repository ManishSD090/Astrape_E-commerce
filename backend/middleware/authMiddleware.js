import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * @desc    Middleware to protect routes by verifying JWT
 */
const protect = async (req, res, next) => {
  let token;

  // Check for token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID from the token payload and attach it to the request object
      // Exclude the password field for security
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * @desc    Middleware to check if the user is an admin
 */
const admin = (req, res, next) => {
  // 'protect' middleware should run first, so req.user will be available
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, proceed
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' }); // 403 Forbidden
  }
};

export { protect, admin };

