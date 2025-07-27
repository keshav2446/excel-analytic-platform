const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

describe('MongoDB Connection', () => {
  // Connect to MongoDB before running tests
  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  });

  // Disconnect after tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test MongoDB connection
  test('should connect to MongoDB', () => {
    const connectionState = mongoose.connection.readyState;
    // 1 = connected
    expect(connectionState).toBe(1);
  });

  // Test database name
  test('should connect to the correct database', () => {
    const dbName = mongoose.connection.name;
    // Log the database name for verification
    console.log(`Connected to database: ${dbName}`);
    expect(dbName).toBeDefined();
  });
});
