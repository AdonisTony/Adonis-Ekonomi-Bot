const { Prefix } = require("../Configs/botConfig");
const { telefonChannelID } = require("../Configs/ecoConfig");
const ecoUserData = require("../Models/ecoUserData");

const { tabanca, money, envantermoney, bakiyen } = require("../Configs/emotes");

module.exports = {
  name: "para-ver",
  aliases: [],
  description: "Başka bir kişiye para vermenize yarayan bir komut.",
  guildOnly: true,
  category: "Üye",
  async execute(message, args, bot) {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    const money = Number(args[1]);

    const memberData = await ecoUserData.findOne({
      guildID: message.guild.id,
      userID: message.author.id,
    });

    const telefonChannel = message.guild.channels.cache.get(telefonChannelID);

    if (!member)
      return message
        .reply({
          content:
            "Geçersiz kullanım, para vericeğin kişiyi etiketle veya ID'sini yazmalısın.",
        })
        .catch(() => {
          return undefined;
        });

    if (!money)
      return message
        .reply({
          content:
            "Geçersiz kullanım, belirtiğin kişiye göndericeğin para miktarını yazmalısın.",
        })
        .catch(() => {
          return undefined;
        });

    if (money < 0)
      return message
        .reply({
          content: `Geçersiz kullanım, belirtiğin para miktarı pozitif bir sayı değil.`,
        })
        .catch(() => {
          return undefined;
        });

    if (member.id === message.author.id)
      return message.reply({
        content: `Geçersiz kullanım, sistemi kendi üstünde kullanamazsın.`,
      });

    try {
      const mentionData = await ecoUserData.findOne({
        guildID: message.guild.id,
        userID: member.id,
      });

      if (memberData.userAccount === false)
        return message
          .reply({
            content: "Geçersiz kullanım, para vermek için bir hesabın olmalı.",
          })
          .catch(() => {
            return undefined;
          });

      if (mentionData.userAccount === false)
        return message
          .reply({
            content:
              "Geçersiz kullanım, para vermek için vericeğin kişi'nin hesabı olmalı.",
          })
          .catch(() => {
            return undefined;
          });

      if (memberData.userMoney < money)
        return message
          .reply({
            content:
              "Geçersiz kullanım, hesabında belirtiğin miktarda para bulunmuyor.",
          })
          .catch(() => {
            return undefined;
          });

      await ecoUserData
        .findOneAndUpdate(
          { guildID: message.guild.id, userID: member.id },
          { $inc: { userMoney: money } },
          { upsert: true }
        )
        .then(async () => {
          await ecoUserData.findOneAndUpdate(
            { guildID: message.guild.id, userID: message.author.id },
            {
              $push: {
                userNotification: [
                  {
                    Type: "Para Verme",
                    Reason: `\`${money.toLocaleString()}\` dolar **${
                      member.user.username
                    }** ${message.guild.emojis.cache.get(
                      money
                    )} adlı kişiye verildi.`,
                  },
                ],
              },
            },
            { upsert: true }
          );

          await ecoUserData.findOneAndUpdate(
            { guildID: message.guild.id, userID: member.id },
            {
              $push: {
                userNotification: [
                  {
                    Type: "Para Geldi",
                    Reason: `\`${money.toLocaleString()}\` dolar **${
                      message.author.username
                    }** ${message.guild.emojis.cache.get(
                      money
                    )} adlı kişi'den geldi.`,
                  },
                ],
              },
            },
            { upsert: true }
          );

          telefonChannel
            .send({
              content: `Heyy! ${member} yeni bir bildiriminiz var (\`${Prefix}bildirimler\`)`,
            })
            .catch(() => {
              return undefined;
            });

          telefonChannel
            .send({
              content: `Heyy! ${message.author} yeni bir bildiriminiz var (\`${Prefix}bildirimler\`)`,
            })
            .catch(() => {
              return undefined;
            });

          message
            .reply({
              content: `Başarılı **${
                member.user.username
              }** adlı kişiye \`${money.toLocaleString()}\` ${message.guild.emojis.cache.get(
                money
              )} dolar verildi.`,
            })
            .catch(() => {
              return undefined;
            });
        })
        .catch(() => {
          message
            .reply({
              content: `Karşı tarafın veya sizin Telefonunuz olmadığından dolayı, Kişiye para gönderemedin lütfen bir yetkili ile iletişime geç. ( parayı gönderdiniz fakat bildirim gitmeyecektir.)`,
            })
            .catch(() => {
              return undefined;
            });
        });

      await ecoUserData.findOneAndUpdate(
        { guildID: message.guild.id, userID: message.author.id },
        { $inc: { userMoney: -money } },
        { upsert: true }
      );
    } catch (err) {
      await ecoUserData
        .findOneAndUpdate(
          { guildID: message.guild.id, userID: message.author.id },
          { $inc: { userMoney: 0 } },
          { upsert: true }
        )
        .then(() => {
          message
            .reply({
              content:
                "Geçersiz kullanım, para vermek için bir hesabın olmalı.",
            })
            .catch(() => {
              return undefined;
            });
        })
        .catch(() => {
          message
            .reply({
              content:
                "Para verme sisteminde bir hata oluştu lütfen bir yetkili ile iletişime geç.",
            })
            .catch(() => {
              return undefined;
            });
        });
    }
  },
};
