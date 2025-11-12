import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) throw new Error("Missing MONGODB_URI in .env");

// Tạo client MongoDB
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Hàm kết nối (chỉ connect 1 lần)
async function connectDB() {
  if (!client.isConnected?.()) {
    // MongoDB v5+ dùng client.topology
    await client.connect();
  }
  return client;
}

// Export client và database helper
export { client, connectDB };
