const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

let mongoServer;

const startInMemoryMongo = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  console.warn('Starting in-memory MongoDB server for local development');
  return uri;
};

const connectDb = async () => {
  let uri = process.env.MONGODB_URI;

  if (!uri) {
    uri = await startInMemoryMongo();
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);

    if (process.env.MONGODB_URI) {
      console.warn('Falling back to in-memory MongoDB server.');
      const fallbackUri = await startInMemoryMongo();
      await mongoose.connect(fallbackUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected to in-memory server');
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDb;
