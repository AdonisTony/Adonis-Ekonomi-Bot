const { MessageEmbed } = require("discord.js");
const { Prefix } = require("../Configs/botConfig");
const table = require("table");
const ecoUserData = require("../Models/ecoUserData");

module.exports = {
  name: "market",
  aliases: [],
  description: "Market komutlarını görmenize yarayan bir komut.",
  guildOnly: true,
  category: "Üye",
  async execute(message, args, bot) {
    const memberData = await ecoUserData.findOne({
      guildID: message.guild.id,
      userID: message.author.id,
    });

    try {
      if (memberData.userAccount === false)
        return message.reply({
          content: `Geçersiz kullanım, markete bakmak için hesabın olmalı.`,
        });

      let marketler = [["#", "Kategori", "Kullanım", "Satıcı"]];
      marketler = marketler.concat(
        bot.commands
          .filter((x) => x.category === "Market")
          .map((value, index) => {
            return [
              `•`,
              `${value.marketType}`,
              `${Prefix}${value.name}`,
              `${value.satıcı}`,
            ];
          })
      );

      let embed = new MessageEmbed().setColor("RANDOM").addField(
        `Market Sıralaması`,
        `\`\`\`diff
${table.table(marketler, {
  border: table.getBorderCharacters(`void`),
  columnDefault: {
    paddingLeft: 0,
    paddingRight: 1,
  },
  columns: {
    0: {
      paddingLeft: 1,
    },
    1: {
      paddingLeft: 1,
    },
    2: {
      paddingLeft: 1,
    },
    3: {
      paddingLeft: 1,
      paddingRight: 1,
    },
  },
  /**
   * @typedef {function} drawHorizontalLine
   * @param {number} index
   * @param {number} size
   * @return {boolean}
   */
  drawHorizontalLine: (index, size) => {
    return index === 0 || index === 1 || index === size;
  },
})}\`\`\``
      );

      message.reply({ embeds: [embed] }).catch(() => {
        return undefined;
      });
    } catch (err) {
      message.reply({
        content: `Geçersiz kullanım, markete bakmak için hesabın olmalı.`,
      });

      return;
    }
  },
};
