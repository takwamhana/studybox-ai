import mongoose from 'mongoose';

const DB_RETRY_DELAY_MS = 5000;
let retryTimeout = null;

export const isDatabaseConnected = () => mongoose.connection.readyState === 1;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('❌ MONGODB_URI is missing. Set it in backend/.env');
    return null;
  }

  try {
    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    if (retryTimeout) {
      clearTimeout(retryTimeout);
      retryTimeout = null;
    }
    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    if (!retryTimeout) {
      console.log(`🔁 Retrying MongoDB connection in ${DB_RETRY_DELAY_MS / 1000}s...`);
      retryTimeout = setTimeout(() => {
        retryTimeout = null;
        connectDB();
      }, DB_RETRY_DELAY_MS);
    }
    return null;
  }
};

export default connectDB;
