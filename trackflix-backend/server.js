const mongoose = require("mongoose");
require("dotenv").config();

// Initialize Firebase Admin SDK (needs FIREBASE_SERVICE_ACCOUNT or serviceAccountKey.json)
require("./config/firebaseAdmin");

const app = require("./app");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Our_web_trackflix";
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }

  if (!process.env.ADMIN_EMAILS) {
    console.warn("⚠️  ADMIN_EMAILS is not set: admin endpoints will reject everyone.");
  }

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });

  // Graceful shutdown (Docker / Render send SIGTERM)
  const shutdown = () => {
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

start();
