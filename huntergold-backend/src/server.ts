import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path'; // Import path module

// Load environment variables from the project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Application = express();
const PORT = process.env.PORT || 3001; // Default to 3001 for the backend

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Simple route for testing
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'Backend is healthy', timestamp: new Date().toISOString() });
});

// Placeholder for other routes
// import authRoutes from './routes/authRoutes'; // Example
// app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
