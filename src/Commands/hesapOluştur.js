const { başlangıçMoney } = require("../Configs/ecoConfig");
const ecoUserData = require("../Models/ecoUserData");

module.exports = {
  name: "hesap-oluştur",
  aliases: [],
  description:
    "Hesap oluşturma sistemi RP yapmak için hesap oluşturmaya yarayan bir sistem.",
  guildOnly: true,
  category: "Üye",
  async execute(message, args, bot) {
    const memberData = await ecoUserData.findOne({
      guildID: message.guild.id,
      userID: message.author.id,
    });

    if (memberData && memberData.userAccount === true)
      return message
        .reply({
          content: "Hesap oluşturamazsın çünkü zaten bir hesabın bulunuyor.",
        })
        .catch(() => {
          return undefined;
        });

    await ecoUserData
      .findOneAndUpdate(
        {
          guildID: message.guild.id,
          userID: message.author.id,
        },
        { $set: { userAccount: true } },
        { upsert: true }
      )
      .then(async () => {
        await ecoUserData
          .findOneAndUpdate(
            {
              guildID: message.guild.id,
              userID: message.author.id,
            },
            { $inc: { userMoney: başlangıçMoney } },
            { upsert: true }
          )
          .then(async () => {
            message
              .reply({
                content: `Hesabınız başarıyla oluşturuldu, ilk defa banka hesabı oluşturduğunuz için \`${başlangıçMoney.toLocaleString()}\` dolar hediye aldınız.`,
              })
              .catch(() => {
                return undefined;
              });

            await ecoUserData.findOneAndUpdate(
              { guildID: message.guild.id, userID: message.author.id },
              {
                $push: {
                  userNotification: [
                    {
                      Type: "Hesap Oluşturma",
                      Reason: `Hesabınız başarıyla oluşturuldu.`,
                    },
                  ],
                },
              },
              { upsert: true }
            );
          })
          .catch((err) => {
            message
              .reply({
                content:
                  "Hesabına başlangıç parası yatırılamadı lütfen bir yetkili ile iletişime geç.",
              })
              .catch(() => {
                return undefined;
              });
          });
      })
      .catch((err) => {
        message
          .reply({
            content:
              "Hesap oluşturamadın lütfen bir yetkili ile iletişime geç.",
          })
          .catch(() => {
            return undefined;
          });
      });
  },
};
