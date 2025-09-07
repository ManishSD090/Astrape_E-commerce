import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import cartRoutes from './routes/cartRoutes.js';


// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// --- THIS IS THE FIX ---
// Add middleware to parse JSON request bodies.
// This must be placed BEFORE your routes are defined.
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);
app.use("/api/items", itemRoutes);
app.use('/api/cart', cartRoutes);

// Root route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

