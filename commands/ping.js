// commands/ping.js
export default {
  name: "ping",
  description: "Replies Pong!",
  execute: async (interaction) => {
    console.log(interaction.member?.nickname);
    await interaction.reply("Pong cai wtf!");
  },
};
