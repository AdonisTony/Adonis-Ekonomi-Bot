const { Prefix } = require("../Configs/botConfig");
const {
  meslekler,
  ownerRolesID,
  telefonChannelID,
  ownerUsersID,
} = require("../Configs/ecoConfig");
const ecoUserData = require("../Models/ecoUserData");

module.exports = {
  name: "ceza-kes",
  aliases: [],
  description: "Ceza kesme işlemi uygulamaya yarayan bir sistem.",
  guildOnly: true,
  category: "Üye",
  async execute(message, args, bot) {
    const roles = [meslekler.polis.roleID, meslekler.hakim.roleID];

    const devletBaskani = message.guild.roles.cache.get(
      meslekler.devletBaşkanı.roleID
    );

    const telefonChannel = message.guild.channels.cache.get(telefonChannelID);

    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    const money = Number(args[1]);

    const reason = args.slice(2).join(" ");

    if (
      !roles.some((x) => message.member.roles.cache.has(x)) &&
      !ownerRolesID.some((x) => message.member.roles.cache.has(x)) &&
      !ownerUsersID.includes(message.author.id)
    )
      return message
        .reply({
          content:
            "Geçersiz kullanım, ceza kesmek için yeterli yetkiye sahip değilsin.",
        })
        .catch(() => {
          return undefined;
        });

    if (!member)
      return message
        .reply({
          content:
            "Geçersiz kullanım, ceza kesiceğin kişiyi etiketle veya ID'sini yazmalısın.",
        })
        .catch(() => {
          return undefined;
        });

    if (!money)
      return message
        .reply({
          content:
            "Geçersiz kullanım, ceza kesiceğin para miktarını yazmalısın.",
        })
        .catch(() => {
          return undefined;
        });

    if (!reason)
      return message
        .reply({
          content: "Geçersiz kullanım, ceza kesme sebebini yazmalısın.",
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
      return message
        .reply({
          content: `Geçersiz kullanım, sistemi kendi üstünde kullanamazsın.`,
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
            content: `Ceza kesmeye çalıştığın kişi'nin bir hesabı bulunmuyor.`,
          })
          .catch(() => {
            return undefined;
          });

      if (memberData.userMoney < money) {
        await ecoUserData
          .findOneAndUpdate(
            {
              guildID: message.guild.id,
              userID: member.id,
            },
            {
              $push: {
                userPunishment: [
                  {
                    punishmentUserID: member.id,
                    punishmentMoney: money,
                    punishmentReason: reason,
                  },
                ],
              },
            },
            { upsert: true }
          )
          .then(async () => {
            message
              .reply({
                content: `Ceza kestiğin kişide kestiğin miktarda para bulunmuyor. \n\nKişinin hesabında para olduğu zaman cezası otomatik olarak kesilicektir.`,
              })
              .catch(() => {
                return undefined;
              });

            telefonChannel
              .send({
                content: `Heyy! ${member} yeni bir bildiriminiz var (\`${Prefix}bildirimler\`)`,
              })
              .catch(() => {
                return undefined;
              });

            await ecoUserData.findOneAndUpdate(
              { guildID: message.guild.id, userID: member.id },
              {
                $push: {
                  userNotification: [{ Type: "Ceza Kesilme", Reason: reason }],
                },
              },
              { upsert: true }
            );

            return;
          })
          .catch(() => {
            message
              .reply({
                content: `Ceza kesme sisteminde bir hata oluştu lütfen bir yetkili ile iletişime geç.`,
              })
              .catch(() => {
                return undefined;
              });

            return;
          });

        return;
      } else {
        await ecoUserData
          .findOneAndUpdate(
            {
              guildID: message.guild.id,
              userID: member.id,
            },
            { $inc: { userMoney: -money } },
            { upsert: true }
          )
          .then(async () => {
            message
              .reply({
                content: `Başarıyla **${
                  member.user.username
                }** adlı kişiden \`${money.toLocaleString()}\` dolar para cezası (\`${reason}\`) sebebiyle kesildi.`,
              })
              .catch(() => {
                return undefined;
              });

            telefonChannel
              .send({
                content: `Heyy! ${member} yeni bir bildiriminiz var (\`${Prefix}bildirimler\`)`,
              })
              .catch(() => {
                return undefined;
              });

            await ecoUserData.findOneAndUpdate(
              { guildID: message.guild.id, userID: member.id },
              {
                $push: {
                  userNotification: [{ Type: "Ceza Kesilme", Reason: reason }],
                },
              },
              { upsert: true }
            );

            devletBaskani.members.forEach(async (member) => {
              await ecoUserData.findOneAndUpdate(
                { guildID: message.guild.id, userID: member.id },
                { $inc: { userMoney: money } },
                { upsert: true }
              );
            });

            return;
          })
          .catch(() => {
            message
              .reply({
                content: `Ceza kesme sisteminde bir hata oluştu lütfen bir yetkili ile iletişime geç.`,
              })
              .catch(() => {
                return undefined;
              });

            return;
          });
      }
    } catch (err) {
      message
        .reply({
          content: `Ceza kesmeye çalıştığın kişi'nin bir hesabı bulunmuyor.`,
        })
        .catch(() => {
          return undefined;
        });

      await ecoUserData.findOneAndUpdate(
        { guildID: message.guild.id, userID: member.id },
        { $inc: { userMoney: 0 } },
        { upsert: true }
      );

      return;
    }
  },
};
