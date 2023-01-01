const {
  ownerRolesID,
  galeriMarket,
  elektronikMarket,
  emlakMarket,
  blackMarket,
  uyusturucuMarket,
  ownerUsersID,
} = require("../Configs/ecoConfig");
const ecoUserData = require("../Models/ecoUserData");
const ecoGuildData = require("../Models/ecoGuildData");
const { Prefix } = require("../Configs/botConfig");

module.exports = {
  name: "düzenle-owner",
  aliases: [],
  description:
    "Düzenle owner envanter ve paranyı düzenlemeye yarayan bir sistem.",
  guildOnly: true,
  category: "Owner",
  async execute(message, args, bot) {
    if (
      !ownerRolesID.some((x) => message.member.roles.cache.has(x)) &&
      !ownerUsersID.includes(message.author.id)
    )
      return;

    if (!args[0])
      return message
        .reply({
          content: `Geçersiz kullanım, doğru argümanlar aşağıda verilmiştir. \n\n**Doğru Kullanım**: \`${Prefix}${this.name} money\` | \`${Prefix}${this.name} envanter\``,
        })
        .catch(() => {
          return undefined;
        });

    if (args[0] === "money") {
      const member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[1]);

      const money = Number(args[2]);

      if (!member)
        return message
          .reply({
            content:
              "Geçersiz kullanım, parasını düzenliceğin kişiyi etiketle veya ID'sini yazmalısın.",
          })
          .catch(() => {
            return undefined;
          });

      if (!money)
        return message
          .reply({
            content: "Geçersiz kullanım, para miktarını yazmalısın.",
          })
          .catch(() => {
            return undefined;
          });

      if (money < 0)
        return message
          .reply({
            content:
              "Geçersiz kullanım, para miktarını pozitif bir şekilde yazmalısın.",
          })
          .catch(() => {
            return undefined;
          });

      const memberData = await ecoUserData.findOne({
        guildID: message.guild.id,
        userID: member.user.id,
      });

      try {
        if (memberData.userAccount === false)
          return message
            .reply({
              content:
                "Parasını düzenlemeye çalıştığın kişi'nin bir hesabı bulunmuyor.",
            })
            .catch(() => {
              return undefined;
            });

        await ecoUserData
          .findOneAndUpdate(
            { guildID: message.guild.id, userID: member.user.id },
            { $inc: { userMoney: money } },
            { upsert: true }
          )
          .then(() => {
            message
              .reply({
                content: `Başarıyla **${
                  member.user.username
                }** adlı kişi'nin parası \`${money.toLocaleString()}\` miktar yapıldı.`,
              })
              .catch(() => {
                return undefined;
              });

            return;
          })
          .catch(() => {
            message
              .reply({
                content:
                  "Para düzenleme sisteminde bir hata oluştu lütfen bir üst yetkili ile iletişime geç.",
              })
              .catch(() => {
                return undefined;
              });

            return;
          });

        return;
      } catch (err) {
        message
          .reply({
            content:
              "Parasını düzenlemeye çalıştığın kişi'nin bir hesabı bulunmuyor.",
          })
          .catch(() => {
            return undefined;
          });

        await ecoUserData.findOneAndUpdate(
          { guildID: message.guild.id, userID: member.user.id },
          { $inc: { userMoney: 0 } },
          { upsert: true }
        );

        return;
      }
    }

    if (args[0] === "envanter") {
      if (!args[1])
        return message
          .reply({
            content: `Geçersiz kullanım, \`${Prefix}${this.name} envanter (ekle, kaldır)\` doğru kullanımlar bu şekilde.`,
          })
          .catch(() => {
            return undefined;
          });

      if (args[1] === "ekle") {
        const member =
          message.mentions.members.first() ||
          message.guild.members.cache.get(args[2]);

        const name = args.slice(3).join(" ");

        if (!member)
          return message
            .reply({
              content:
                "Geçersiz kullanım, envanterini düzenliceğin kişiyi etiketle veya ID'sini yazmalısın.",
            })
            .catch(() => {
              return undefined;
            });

        if (!name)
          return message
            .reply({
              content: "Geçersiz kullanım, bir ürün ismi yazmalısın.",
            })
            .catch(() => {
              return undefined;
            });

        let array = [
          galeriMarket,
          elektronikMarket,
          emlakMarket,
          blackMarket,
          uyusturucuMarket,
        ];

        try {
          let data = array.map((x) => x);

          let x = data.find(
            (x) =>
              x[
                x.indexOf(
                  x
                    .filter((b) => b.Name != undefined)
                    .find((z) => z.Name == name)
                )
              ]
          );

          let ürün = x.find((x) => x.Name === name);

          if (ürün) {
            const memberData = await ecoUserData.findOne({
              guilID: message.guild.id,
              userID: member.user.id,
            });

            var nameAlready =
              memberData &&
              memberData.userInventory
                .filter((x) => x.Type === ürün.Type)
                .map((x) => x.Name);
            var typeAlready =
              memberData &&
              memberData.userInventory
                .filter((x) => x.Type === ürün.Type)
                .map((x) => x.Type);

            if (
              (nameAlready && nameAlready.includes(ürün.Name)) ||
              (nameAlready && typeAlready.includes(ürün.Type))
            )
              return message
                .reply({
                  content: `Olamaz bu kişi zaten \`${nameAlready}\` adlı bir tane ürüne sahip başka **${ürün.Type}** kategorisindeki bir ürüne sahip olamaz.`,
                })
                .catch(() => {
                  return undefined;
                });

            await ecoUserData
              .findOneAndUpdate(
                {
                  guildID: message.guild.id,
                  userID: member.user.id,
                },
                {
                  $push: {
                    userInventory: [
                      {
                        ID: ürün.ID,
                        Name: ürün.Name,
                        Description: ürün.Description,
                        realPrice: ürün.Price,
                        SahipName: member.user.username,
                        SahipID: member.user.id,
                        Type: ürün.Type,
                      },
                    ],
                  },
                },
                { upsert: true }
              )
              .then(() => {
                message
                  .reply({
                    content: `Başarıyla **${member.user.username}** adlı kişiye \`${ürün.Name}\` adlı ürün verildi.`,
                  })
                  .catch(() => {
                    return undefined;
                  });

                return;
              })
              .catch(() => {
                return undefined;
              });

            await ecoGuildData
              .findOneAndUpdate(
                {
                  guildID: message.guild.id,
                },
                {
                  $push: {
                    guildInventory: [
                      {
                        ID: ürün.ID,
                        Name: ürün.Name,
                        Description: ürün.Description,
                        realPrice: ürün.Price,
                        SahipName: member.user.username,
                        SahipID: member.user.id,
                        Type: ürün.Type,
                      },
                    ],
                  },
                },
                { upsert: true }
              )
              .catch(() => {
                return undefined;
              });

            return;
          } else {
            message
              .reply({
                content: `\`${name}\` adlı bir ürün bulunamadı lütfen geçerli bir ürün ismi yaz.`,
              })
              .catch(() => {
                return undefined;
              });

            return;
          }
        } catch (err) {
          message
            .reply({
              content: `\`${name}\` adlı bir ürün bulunamadı lütfen geçerli bir ürün ismi yaz.`,
            })
            .catch(() => {
              return undefined;
            });

          return;
        }
      }

      if (args[1] === "kaldır") {
        const member =
          message.mentions.members.first() ||
          message.guild.members.cache.get(args[2]);

        const name = args.slice(3).join(" ");

        if (!member)
          return message
            .reply({
              content:
                "Geçersiz kullanım, envanterini düzenliceğin kişiyi etiketle veya ID'sini yazmalısın.",
            })
            .catch(() => {
              return undefined;
            });

        if (!name)
          return message
            .reply({
              content: "Geçersiz kullanım, bir ürün ismi yazmalısın.",
            })
            .catch(() => {
              return undefined;
            });

        let array = [
          galeriMarket,
          elektronikMarket,
          emlakMarket,
          blackMarket,
          uyusturucuMarket,
        ];

        try {
          let data = array.map((x) => x);

          let x = data.find(
            (x) =>
              x[
                x.indexOf(
                  x
                    .filter((b) => b.Name != undefined)
                    .find((z) => z.Name == name)
                )
              ]
          );

          let ürün = x.find((x) => x.Name === name);

          if (ürün) {
            const memberData = await ecoUserData.findOne({
              guilID: message.guild.id,
              userID: member.user.id,
            });

            var datas = memberData.userInventory.map((x) => x.Name);

            if (!datas.includes(name))
              return message
                .reply({
                  content: `Olamaz \`${name}\` adlı ürün kişide bulunmuyor.`,
                })
                .catch(() => {
                  return undefined;
                });

            await ecoUserData
              .findOneAndUpdate(
                {
                  guildID: message.guild.id,
                  userID: member.user.id,
                },
                {
                  $pull: {
                    userInventory: {
                      ID: ürün.ID,
                      Name: ürün.Name,
                      Description: ürün.Description,
                      realPrice: ürün.Price,
                      SahipName: member.user.username,
                      SahipID: member.user.id,
                      Type: ürün.Type,
                    },
                  },
                },
                { upsert: true }
              )
              .then(() => {
                message
                  .reply({
                    content: `Başarıyla **${member.user.username}** adlı kişi'nin \`${ürün.Name}\` adlı ürün kaldırıldı.`,
                  })
                  .catch(() => {
                    return undefined;
                  });

                return;
              })
              .catch(() => {
                return undefined;
              });

            await ecoGuildData
              .findOneAndUpdate(
                {
                  guildID: message.guild.id,
                },
                {
                  $pull: {
                    guildInventory: {
                      ID: ürün.ID,
                      Name: ürün.Name,
                      Description: ürün.Description,
                      realPrice: ürün.Price,
                      SahipName: member.user.username,
                      SahipID: member.user.id,
                      Type: ürün.Type,
                    },
                  },
                },
                { upsert: true }
              )
              .catch(() => {
                return undefined;
              });

            return;
          } else {
            message
              .reply({
                content: `\`${name}\` adlı bir ürün bulunamadı lütfen geçerli bir ürün ismi yaz.`,
              })
              .catch(() => {
                return undefined;
              });

            return;
          }
        } catch (err) {
          message
            .reply({
              content: `\`${name}\` adlı bir ürün bulunamadı lütfen geçerli bir ürün ismi yaz.`,
            })
            .catch(() => {
              return undefined;
            });

          return;
        }
      }
    }
  },
};
