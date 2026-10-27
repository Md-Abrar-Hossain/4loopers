const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Our_web_trackflix";

const client = new MongoClient(uri); // No options needed with recent driver

let db;

async function connect() {
  if (db) return db;

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db(); // DB name from URI
    return db;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

module.exports = { connect };
