const fs = require("fs");
const bot = global.client;

try {
  const eventFiles = fs
    .readdirSync("./src/Events")
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`../Events/${file}`);
    bot.on(event.conf.name, event);
  }
} catch (err) {
  console.log("Error: " + err);
}
