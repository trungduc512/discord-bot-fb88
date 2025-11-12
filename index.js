// index.js
import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
} from "discord.js";
import { connectDB } from "./mongo.js";
import dotenv from "dotenv";
import commands from "./commands/command.strategy.js";

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

// Đăng ký lệnh slash khi bot khởi động
(async () => {
  const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);
  const commandsData = Array.from(commands.values()).map((cmd) =>
    new SlashCommandBuilder()
      .setName(cmd.name)
      .setDescription(cmd.description)
      .toJSON()
  );

  try {
    console.log("⚡ Deploying slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commandsData }
    );
    console.log("✅ Slash commands deployed:");
    Array.from(commands.keys()).forEach((name) => console.log(`- ${name}`));
  } catch (error) {
    console.error(error);
  }
})();

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

  const commandName = interaction.commandName;
  console.log("Command Name:", commandName);

  const command = commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply("Đã xảy ra lỗi khi chạy lệnh!");
  }
});

// Đăng nhập bot
client.login(process.env.BOT_TOKEN);
