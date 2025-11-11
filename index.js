// index.js
import { Client, GatewayIntentBits, SlashCommandBuilder } from "discord.js";
import { connectDB } from "./mongo.js";
import dotenv from "dotenv";

const pingCommand = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

// Cấu hình biến môi trường từ file .env
dotenv.config();

// Tạo bot client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Khi bot khởi động, kết nối database
client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
  connectDB()
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB", err);
    });
});

// Khi bot thấy tin nhắn
client.on("messageCreate", (message) => {
  // Bỏ qua tin nhắn của chính bot
  if (message.author.bot) return;

  const userId = message.author.id;
  console.log("User ID:", userId);

  // Lệnh đơn giản
  if (message.content === "!ping") {
    message.reply("Mẹ mày béo!");
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    console.log(interaction.member.nickname);
    await interaction.reply("Pong cai ditmemay!");
  }
});

// Đăng nhập bot
client.login(process.env.BOT_TOKEN);
