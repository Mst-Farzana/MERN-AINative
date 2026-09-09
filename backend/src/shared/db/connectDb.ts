import mongoose from 'mongoose';
import { env } from '../../config/env.js';

interface ConnectDBResult {
  dbName: string;
  host: string;
}

const connectDB = async (): Promise<ConnectDBResult> => {
  try {
    const connection = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    const dbName = connection.connection.db?.databaseName ?? 'unknown';
    const host = connection.connection.host ?? 'unknown';

    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database: ${dbName}`);
    console.log(`🌐 Host: ${host}`);

    return { dbName, host };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unknown error occurred while connecting to MongoDB';

    console.error('❌ MongoDB Connection Error:', errorMessage);
    throw new Error(errorMessage);
  }
};

export default connectDB;
