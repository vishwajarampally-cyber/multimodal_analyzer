const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

let mongoServer;
let connectionPromise;

const startInMemoryMongo = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  console.warn('Starting in-memory MongoDB server for local development');
  return uri;
};

const connectDb = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  let uri = process.env.MONGODB_URI;

  if (!uri && process.env.VERCEL) {
    throw new Error('MONGODB_URI is required when deploying to Vercel.');
  }

  if (!uri) {
    uri = await startInMemoryMongo();
  }

  connectionPromise = mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await connectionPromise;
    connectionPromise = null;
    console.log('MongoDB connected');
    return mongoose.connection;
  } catch (error) {
    connectionPromise = null;
    console.error('MongoDB connection failed:', error.message);

    if (process.env.MONGODB_URI && !process.env.VERCEL) {
      console.warn('Falling back to in-memory MongoDB server.');
      const fallbackUri = await startInMemoryMongo();
      await mongoose.connect(fallbackUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected to in-memory server');
      return mongoose.connection;
    }

    throw error;
  }
};

module.exports = connectDb;
