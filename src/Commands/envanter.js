const { MessageEmbed } = require("discord.js");
const ecoUserData = require("../Models/ecoUserData");

const { tabanca, money, envantermoney, bakiyen } = require("../Configs/emotes");

module.exports = {
  name: "envanter",
  aliases: [],
  description: "Envanterinizi görmenize yarayan bir sistem.",
  guildOnly: true,
  category: "Üye",
  async execute(message, args, bot) {
    const memberData = await ecoUserData.findOne({
      guildID: message.guild.id,
      userID: message.author.id,
    });

    try {
      if (memberData.userAccount === false)
        return message
          .reply({
            content: "Geçersiz kullanım, bir hesabın bulunmuyor.",
          })
          .catch(() => {
            return undefined;
          });

      const embed = new MessageEmbed()
        .setAuthor({
          name: message.guild.name,
          iconURL: message.guild.iconURL({ dynamic: true }),
        })
        .setColor("RANDOM")
        .addField(
          `${message.guild.emojis.cache.get(envantermoney)} Banka Hesabında:`,
          `\`${
            (memberData && memberData.userMoney.toLocaleString()) || 0
          }\` doların var.`
        )
        .addField(
          `${message.guild.emojis.cache.get(tabanca)} Envanterin:`,
          `\`${
            memberData.userInventory.map((x) => x.Name).join(", ") ||
            `Envanterinde hiç bir ürün bulunmuyor.`
          }\``
        )
        .setThumbnail(message.author.avatarURL({ dynamic: true }));
      message.reply({ embeds: [embed] }).catch(() => {
        return undefined;
      });
    } catch (err) {
      await ecoUserData
        .findOneAndUpdate(
          {
            guildID: message.guild.id,
            userID: message.author.id,
          },
          { $set: { userAccount: false } },
          { upsert: true }
        )
        .then(() => {
          message
            .reply({
              content: "Geçersiz kullanım, bir hesabın bulunmuyor.",
            })
            .catch(() => {
              return undefined;
            });
        })
        .catch(() => {
          return undefined;
        });
    }
  },
};
