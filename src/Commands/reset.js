const { ownerRolesID, ownerUsersID } = require("../Configs/ecoConfig");
const ecoUserData = require("../Models/ecoUserData");

module.exports = {
  name: "reset",
  aliases: [],
  description:
    "Reset sistemi kişilerin parasını ve envanterini sıfırlamaya yarayan bir sistem.",
  guildOnly: true,
  category: "Owner",
  async execute(message, args, bot) {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[1]);

    if (
      !ownerRolesID.some((x) => message.member.roles.cache.has(x)) &&
      !ownerUsersID.includes(message.author.id)
    )
      return;

    if (args[0] === "money") {
      if (!member)
        return message
          .reply({
            content: `Geçersiz kullanım, kişiyi etiketle veya ID'sini yazmalısın.`,
          })
          .catch(() => {
            return undefined;
          });

      const memberData = await ecoUserData.findOne({
        guildID: message.guild.id,
        userID: member.id,
      });

      try {
        if (memberData.userAccount === false)
          return message
            .reply({
              content: `Geçersiz kullanım, kişi'nin bir hesabı bulunmuyor.`,
            })
            .catch(() => {
              return undefined;
            });

        await ecoUserData
          .findOneAndUpdate(
            { guildID: message.guild.id, userID: member.id },
            { $inc: { userMoney: -memberData.userMoney } },
            {
              upsert: true,
            }
          )
          .then(() => {
            message
              .reply({
                content: `Başarıyla **${member.user.username}** adlı kişi'nin parası sıfırlandı.`,
              })
              .catch(() => {
                return undefined;
              });

            return;
          })
          .catch(() => {
            return undefined;
          });
      } catch (err) {
        message
          .reply({
            content: `Geçersiz kullanım, kişi'nin bir hesabı bulunmuyor.`,
          })
          .catch(() => {
            return undefined;
          });

        return;
      }
    }

    if (args[0] === "envanter") {
      if (!member)
        return message
          .reply({
            content: `Geçersiz kullanım, kişiyi etiketle veya ID'sini yazmalısın.`,
          })
          .catch(() => {
            return undefined;
          });

      const memberData = await ecoUserData.findOne({
        guildID: message.guild.id,
        userID: member.id,
      });

      try {
        if (memberData.userAccount === false)
          return message
            .reply({
              content: `Geçersiz kullanım, kişi'nin bir hesabı bulunmuyor.`,
            })
            .catch(() => {
              return undefined;
            });

        memberData.userInventory.map(async (x) => {
          await ecoUserData
            .findOneAndUpdate(
              {
                guildID: message.guild.id,
                userID: member.id,
              },
              {
                $pull: {
                  userInventory: {
                    ID: x.ID,
                    Name: x.Name,
                    Description: x.Description,
                    realPrice: x.Price,
                    SahipName: x.SahipName,
                    SahipID: x.SahipID,
                    Type: x.Type,
                  },
                },
              },
              { upsert: true }
            )
            .catch(() => {
              return undefined;
            });
        });

        message
          .reply({
            content: `Başarıyla **${member.user.username}** adlı kişi'nin envanteri sıfırlandı.`,
          })
          .catch(() => {
            return undefined;
          });
      } catch (err) {
        message
          .reply({
            content: `Geçersiz kullanım, kişi'nin bir hesabı bulunmuyor.`,
          })
          .catch(() => {
            return undefined;
          });

        return;
      }
    }
  },
};
