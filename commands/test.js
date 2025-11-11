// commands/ping.js
export default {
  name: "test",
  description: "Replies test!",
  execute: async (interaction) => {
    console.log(interaction.member?.nickname);
    await interaction.reply("test strategy!");
  },
};
