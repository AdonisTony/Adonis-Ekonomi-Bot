const { Client, Collection } = require("discord.js");
const bot = (global.client = new Client({
  fetchAllMembers: true,
  intents: 32767,
}));

const { Token } = require("./src/Configs/botConfig");

bot.commands = new Collection();
bot.aliases = new Collection();

require("./src/Handlers/mongoHandler");
require("./src/Handlers/eventHandler");
require("./src/Handlers/commandHandler");

bot
  .login(Token)
  .then(() => console.log("Başarıyla bot aktif oldu."))
  .catch((err) => console.log("Başarısız bot aktif olamadı", err));
