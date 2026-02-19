import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri || uri.includes('<') || uri.includes('xxxxx')) {
    console.warn('MongoDB: No valid MONGO_URI in backend/.env — server will run but registration/login will fail until you add a real connection string.');
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.warn('Server is still running. Add a valid MONGO_URI in backend/.env to enable auth.');
  }
}
