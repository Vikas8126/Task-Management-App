import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://vikasyadhuvanshi_db_user:ktlfqaQ5CBza44z0@taskflow.taeetzj.mongodb.net/taskflow_app?retryWrites=true&w=majority&appName=TaskFlow';

export const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB Disconnected');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error);
  }
};
