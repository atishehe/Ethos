import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRoutes from './routes/usersRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import collegeRoutes from './routes/collegeRoutes.js'; 
import competitionStageRoutes from './routes/competitionStages.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/college', collegeRoutes); 
app.use('/api/competitionStages', competitionStageRoutes); 

// Start server after DB connection
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};
startServer();
