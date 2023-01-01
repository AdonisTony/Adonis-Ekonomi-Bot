const ecoUserData = require("../Models/ecoUserData");

const { tabanca, money, envantermoney, bakiyen } = require("../Configs/emotes");

module.exports = {
  name: "hesabım",
  aliases: [],
  description: "Hesabınızda ne kadar paranız var bakabileceğiniz bir sistem.",
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

      message
        .reply({
          content: `Banka hesabında \`${
            (memberData && memberData.userMoney.toLocaleString()) || 0
          }\` ${message.guild.emojis.cache.get(money)} doların var.`,
        })
        .catch(() => {
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
