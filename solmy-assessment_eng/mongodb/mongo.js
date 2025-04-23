const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017/solmytest';
const dbName = 'solmytest';

let db = null;

async function connectDB() {
  if (db) return db;
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const client = await MongoClient.connect(url, { useUnifiedTopology: true });
      db = client.db(dbName);
      console.log('Connected to MongoDB');
      await initializeCounters();
      return db;
    } catch (err) {
      retries++;
      console.error(`Failed to connect to MongoDB (attempt ${retries}/${maxRetries})`, err);
      if (retries === maxRetries) {
        throw new Error('Max retries reached. Could not connect to MongoDB.');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

async function initializeCounters() {
  const db = await connectDB();
  const countersCollection = db.collection('counters');
  const counterExists = await countersCollection.findOne({ _id: 'userId' });
  if (!counterExists) {
    await countersCollection.insertOne({ _id: 'userId', sequence: 0 });
    console.log('Initialized counters collection with userId sequence');
  }
}

async function getNextUserId() {
  const db = await connectDB();
  const counter = await db.collection('counters').findOneAndUpdate(
    { _id: 'userId' },
    { $inc: { sequence: 1 } },
    { upsert: true, returnDocument: 'after' }
  );

  return counter.sequence;
}

module.exports = { connectDB, getNextUserId };