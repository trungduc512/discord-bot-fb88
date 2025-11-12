// command.strategy.js
import pingCommand from "./ping.js";
import testCommand from "./test.js";

// Tạo Map lưu tất cả command
const commands = new Map();
commands.set(pingCommand.name, pingCommand);
commands.set(testCommand.name, testCommand);

export default commands;
