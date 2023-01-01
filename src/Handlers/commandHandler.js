const fs = require("fs");
const bot = global.client;

try {
  const commandFiles = fs
    .readdirSync("./src/Commands")
    .filter((file) => file.endsWith(".js"));

  commandFiles.forEach((file) => {
    const command = require(`../Commands/${file}`);
    bot.commands.set(command.name, command);

    if (command.aliases) {
      command.aliases.forEach((aliase) => {
        bot.aliases.set(aliase, command.name);
      });
    }
  });
} catch (err) {
  console.log("Error: ", err);
}
