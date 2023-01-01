const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const ecoUserData = require("../Models/ecoUserData");
const { uyusturucuMarket } = require("../Configs/ecoConfig");
const table = require("table");

module.exports = {
  name: "uyuşturucu-market",
  aliases: [],
  description: "Uyuşturucu market üzerinden uyuşturucu satın alabilirsiniz.",
  guildOnly: true,
  marketType: "Uyuşturucu Market",
  category: "Market",
  satıcı: "Baron",
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

      const backButton = new MessageButton({
        style: "PRIMARY",
        label: "◄",
        customId: "back",
      });
      const forwardButton = new MessageButton({
        style: "PRIMARY",
        label: "►",
        customId: "forward",
      });

      const list = [...uyusturucuMarket.values()];

      const generateEmbed = async (start) => {
        let market = [["ID", "Name", "Description", "Price"]];
        market = market.concat(
          await Promise.all(
            uyusturucuMarket
              .map((value) => {
                return [
                  `#${value.ID}`,
                  `${value.Name}`,
                  `${value.Description}`,
                  `${value.Price.toLocaleString()}`,
                ];
              })
              .slice(start, start + 10)
          )
        );

        return new MessageEmbed().setColor("RANDOM").addField(
          `${this.marketType} | Mevcut Paran: \`${
            (memberData && memberData.userMoney.toLocaleString()) || 0
          }\``,
          `\`\`\`css
${table.table(market, {
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
      };

      const canFitOnOnePage = list.length <= 10;
      const embedMessage = await message
        .reply({
          embeds: [await generateEmbed(0)],
          components: canFitOnOnePage
            ? []
            : [new MessageActionRow({ components: [forwardButton] })],
        })
        .catch(() => {
          return undefined;
        });

      if (canFitOnOnePage) return;

      const collector = embedMessage.createMessageComponentCollector({
        filter: ({ user }) => user.id === message.author.id,
      });

      let currentIndex = 0;
      collector.on("collect", async (interaction) => {
        interaction.customId === "back"
          ? (currentIndex -= 10)
          : (currentIndex += 10);
        await interaction.update({
          embeds: [await generateEmbed(currentIndex)],
          components: [
            new MessageActionRow({
              components: [
                ...(currentIndex ? [backButton] : []),
                ...(currentIndex + 10 < list.length ? [forwardButton] : []),
              ],
            }),
          ],
        });
      });
    } catch (err) {
      message.reply({
        content: `Geçersiz kullanım, markete bakmak için hesabın olmalı.`,
      });

      return;
    }
  },
};
