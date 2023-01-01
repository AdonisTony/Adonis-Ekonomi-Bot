const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { Prefix } = require("../Configs/botConfig");
const {
  meslekler,
  blackMarket,
  uyusturucuMarket,
  elektronikMarket,
  galeriMarket,
  emlakMarket,
  telefonChannelID,
} = require("../Configs/ecoConfig");
const ecoUserData = require("../Models/ecoUserData");
const ecoGuildData = require("../Models/ecoGuildData");

module.exports = {
  name: "sat",
  aliases: [],
  description: "Meslekleri olan kişilerin ürün satıcağı bir sistem.",
  guildOnly: true,
  category: "Üye",
  async execute(message, args, bot) {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[1]);

    const price = Number(args[2]);

    const name = args.slice(3).join(" ");

    var meslekRolesArray = [
      meslekler.baron.sellerRoleID,
      meslekler.galerici.sellerRoleID,
      meslekler.elektronikçi.sellerRoleID,
      meslekler.emlakçı.sellerRoleID,
    ];

    const telefonChannel = message.guild.channels.cache.get(telefonChannelID);

    if (meslekRolesArray.some((x) => message.member.roles.cache.has(x))) {
      if (!args[0])
        return message
          .reply({
            content: `Satış Komutları: \n${Prefix}${this.name} (silah, telefon, uyuşturucu, araba, ev)`,
          })
          .catch(() => {
            return undefined;
          });

      if (args[0] === "ev") {
        if (!message.member.roles.cache.has(meslekler.emlakçı.sellerRoleID))
          return message
            .reply({
              content: "Geçersiz kullanım, yetkiye sahip değilsin.",
            })
            .catch(() => {
              return undefined;
            });

        if (!member)
          return message
            .reply({
              content:
                "Geçersiz kullanım, satıcağın kişiyi etiketle veya ID'sini yazmalısın.",
            })
            .catch(() => {
              return undefined;
            });

        if (!price)
          return message
            .reply({
              content: "Geçersiz kullanım, fiyat belirtmen gerekiyor.",
            })
            .catch(() => {
              return undefined;
            });

        if (!name)
          return message
            .reply({
              content: "Geçersiz kullanım, ev türü belirtmen gerekiyor.",
            })
            .catch(() => {
              return undefined;
            });

        if (price < 0)
          return message
            .reply({
              content: `Geçersiz kullanım, belirtiğin fiyat pozitif bir sayı değil.`,
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

        try {
          const memberData = await ecoUserData.findOne({
            guildID: message.guild.id,
            userID: member.user.id,
          });

          if (memberData.userAccount === false)
            return message
              .reply({
                content:
                  "Geçersiz kullanım, belirtiğin kişi'nin hesabı bulunmuyor.",
              })
              .catch(() => {
                return undefined;
              });

          let ürün =
            emlakMarket[
              emlakMarket.indexOf(emlakMarket.find((x) => x.Name == name))
            ];

          const embed = new MessageEmbed().setAuthor({
            name: message.guild.name,
            iconURL: message.guild.iconURL({ dynamic: true }),
          });

          if (ürün) {
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

            const row = new MessageActionRow().addComponents(
              new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("✅")
                .setCustomId("yes"),
              new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("❌")
                .setCustomId("no")
            );

            embed.setDescription(
              `${message.author} size **${
                ürün.Name
              }** adlı ürünü \`${price.toLocaleString()}\` dolara satmak istiyor kabul ediyorsanız tik butonuna basın. \n\n\`Süre: 30 saniye\``
            );
            embed.setColor("YELLOW");
            embed.setFooter({
              text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Bekleniyor.`,
            });

            await message.channel
              .send({
                content: `${member},`,
                embeds: [embed],
                components: [row],
              })
              .then(async (msg) => {
                const collector = msg.channel.createMessageComponentCollector({
                  time: 30000,
                  max: 100,
                  errors: ["time"],
                });

                collector.on("collect", async (button) => {
                  if (button.user.id === member.user.id) {
                    if (button.customId === "yes") {
                      try {
                        if (memberData.userMoney < price) {
                          button
                            .reply({
                              content:
                                "Satış işlemi gerçekleştirilemedi. Sebep: Yetersiz Para",
                              ephemeral: true,
                            })
                            .catch(() => {
                              return undefined;
                            });

                          embed.setDescription(
                            `Satış işlemi kişinin parası yetmediği için gerçekleşmedi.`
                          );
                          embed.setFooter({
                            text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Gerçekleşmedi.`,
                          });

                          msg
                            .edit({ embeds: [embed], components: [] })
                            .catch(() => {
                              return undefined;
                            });

                          return;
                        } else {
                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: message.author.id,
                            },
                            { $inc: { userMoney: price } },
                            {
                              upsert: true,
                            }
                          );

                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: member.user.id,
                            },
                            { $inc: { userMoney: -price } },
                            {
                              upsert: true,
                            }
                          );

                          await ecoUserData.findOneAndUpdate(
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
                                    sellerPrice: price,
                                    SahipName: member.user.username,
                                    SahipID: member.user.id,
                                    Type: ürün.Type,
                                  },
                                ],
                              },
                            },
                            { upsert: true }
                          );

                          await ecoGuildData.findOneAndUpdate(
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
                                    sellerPrice: price,
                                    SahipName: member.user.username,
                                    SahipID: member.user.id,
                                    Type: ürün.Type,
                                  },
                                ],
                              },
                            },
                            { upsert: true }
                          );

                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: message.author.id,
                            },
                            {
                              $push: {
                                userNotification: [
                                  {
                                    Type: "Ev Satıldı",
                                    Reason: `**${member.user.username}** adlı kişiye \`${ürün.Name}\` satıldı.`,
                                  },
                                ],
                              },
                            },
                            { upsert: true }
                          );

                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: member.user.id,
                            },
                            {
                              $push: {
                                userNotification: [
                                  {
                                    Type: "Ev Alındı",
                                    Reason: `**${message.author.username}** adlı kişi'den \`${ürün.Name}\` alındı.`,
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

                          button
                            .reply({
                              content:
                                "Başarıyla satış işlemini gerçekleştirdin.",
                              ephemeral: true,
                            })
                            .catch(() => {
                              return undefined;
                            });

                          embed.setColor("GREEN");
                          embed.setDescription(
                            `Satış işlemi başarıyla tamamlandı.`
                          );
                          embed.setFooter({
                            text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Gerçekleşti.`,
                          });

                          msg
                            .edit({ embeds: [embed], components: [] })
                            .catch(() => {
                              return undefined;
                            });

                          return;
                        }
                      } catch (err) {
                        await ecoUserData
                          .findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: member.user.id,
                            },
                            { $inc: { userMoney: 0 } },
                            { upsert: true }
                          )
                          .then(() => {
                            button
                              .reply({
                                content:
                                  "Satış işlemi gerçekleştirilemedi. Sebep: Yetersiz Para",
                                ephemeral: true,
                              })
                              .catch(() => {
                                return undefined;
                              });
                          })
                          .catch(() => {
                            button
                              .reply({
                                content:
                                  "Satış işleminde bir hata bulunuyor lütfen bir yetkili ile iletişime geç.",
                                ephemeral: true,
                              })
                              .catch(() => {
                                return undefined;
                              });
                          });

                        return;
                      }
                    }

                    if (button.customId === "no") {
                      button
                        .reply({
                          content: "Satış işlemini **gerçekleştirmedin**.",
                          ephemeral: true,
                        })
                        .catch(() => {
                          return undefined;
                        });

                      embed.setColor("RED");
                      embed.setDescription(
                        `Satış işlemi başarısız tamamlanamadı.`
                      );
                      embed.setFooter({
                        text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Gerçekleşmedi.`,
                      });

                      msg
                        .edit({ embeds: [embed], components: [] })
                        .catch(() => {
                          return undefined;
                        });

                      return;
                    }
                  } else {
                    button
                      .reply({
                        content: `Bu satış işlemi senin için değil!`,
                        ephemeral: true,
                      })
                      .catch(() => {
                        return undefined;
                      });

                    return;
                  }
                });
              })
              .catch(() => {
                return undefined;
              });
          } else {
            message
              .reply({
                content:
                  "Geçersiz kullanım, belirtiğin ürün sistemde bulunmuyor.",
              })
              .catch(() => {
                return undefined;
              });

            return;
          }
        } catch (err) {
          await ecoUserData
            .findOneAndUpdate(
              {
                guildID: message.guild.id,
                userID: member.user.id,
              },
              { $set: { userAccount: false } },
              { upsert: true }
            )
            .then(() => {
              message
                .reply({
                  content:
                    "Geçersiz kullanım, belirtiğin kişi'nin hesabı bulunmuyor.",
                })
                .catch(() => {
                  return undefined;
                });
            })
            .catch(() => {
              return undefined;
            });
        }
      }

      if (args[0] === "silah") {
        if (!message.member.roles.cache.has(meslekler.baron.sellerRoleID))
          return message
            .reply({
              content: "Geçersiz kullanım, yetkiye sahip değilsin.",
            })
            .catch(() => {
              return undefined;
            });

        if (!member)
          return message
            .reply({
              content:
                "Geçersiz kullanım, satıcağın kişiyi etiketle veya ID'sini yazmalısın.",
            })
            .catch(() => {
              return undefined;
            });

        if (!price)
          return message
            .reply({
              content: "Geçersiz kullanım, fiyat belirtmen gerekiyor.",
            })
            .catch(() => {
              return undefined;
            });

        if (!name)
          return message
            .reply({
              content: "Geçersiz kullanım, silah ismi belirtmen gerekiyor.",
            })
            .catch(() => {
              return undefined;
            });

        if (price < 0)
          return message
            .reply({
              content: `Geçersiz kullanım, belirtiğin fiyat pozitif bir sayı değil.`,
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

        try {
          const memberData = await ecoUserData.findOne({
            guildID: message.guild.id,
            userID: member.user.id,
          });

          if (memberData.userAccount === false)
            return message
              .reply({
                content:
                  "Geçersiz kullanım, belirtiğin kişi'nin hesabı bulunmuyor.",
              })
              .catch(() => {
                return undefined;
              });

          let ürün =
            blackMarket[
              blackMarket.indexOf(blackMarket.find((x) => x.Name == name))
            ];

          const embed = new MessageEmbed().setAuthor({
            name: message.guild.name,
            iconURL: message.guild.iconURL({ dynamic: true }),
          });

          if (ürün) {
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

            const row = new MessageActionRow().addComponents(
              new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("✅")
                .setCustomId("yes"),
              new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("❌")
                .setCustomId("no")
            );

            embed.setDescription(
              `${message.author} size **${
                ürün.Name
              }** adlı ürünü \`${price.toLocaleString()}\` dolara satmak istiyor kabul ediyorsanız tik butonuna basın. \n\n\`Süre: 30 saniye\``
            );
            embed.setColor("YELLOW");
            embed.setFooter({
              text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Bekleniyor.`,
            });

            await message.channel
              .send({
                content: `${member},`,
                embeds: [embed],
                components: [row],
              })
              .then(async (msg) => {
                const collector = msg.channel.createMessageComponentCollector({
                  time: 30000,
                  max: 100,
                  errors: ["time"],
                });

                collector.on("collect", async (button) => {
                  if (button.user.id === member.user.id) {
                    if (button.customId === "yes") {
                      try {
                        if (memberData.userMoney < price) {
                          button
                            .reply({
                              content:
                                "Satış işlemi gerçekleştirilemedi. Sebep: Yetersiz Para",
                              ephemeral: true,
                            })
                            .catch(() => {
                              return undefined;
                            });

                          embed.setDescription(
                            `Satış işlemi kişinin parası yetmediği için gerçekleşmedi.`
                          );
                          embed.setFooter({
                            text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Gerçekleşmedi.`,
                          });

                          msg
                            .edit({ embeds: [embed], components: [] })
                            .catch(() => {
                              return undefined;
                            });

                          return;
                        } else {
                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: message.author.id,
                            },
                            { $inc: { userMoney: price } },
                            {
                              upsert: true,
                            }
                          );

                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: member.user.id,
                            },
                            { $inc: { userMoney: -price } },
                            {
                              upsert: true,
                            }
                          );

                          await ecoUserData.findOneAndUpdate(
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
                                    sellerPrice: price,
                                    SahipName: member.user.username,
                                    SahipID: member.user.id,
                                    Type: ürün.Type,
                                  },
                                ],
                              },
                            },
                            { upsert: true }
                          );

                          await ecoGuildData.findOneAndUpdate(
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
                                    sellerPrice: price,
                                    SahipName: member.user.username,
                                    SahipID: member.user.id,
                                    Type: ürün.Type,
                                  },
                                ],
                              },
                            },
                            { upsert: true }
                          );

                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: message.author.id,
                            },
                            {
                              $push: {
                                userNotification: [
                                  {
                                    Type: "Silah Satıldı",
                                    Reason: `**${member.user.username}** adlı kişiye \`${ürün.Name}\` satıldı.`,
                                  },
                                ],
                              },
                            },
                            { upsert: true }
                          );

                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: member.user.id,
                            },
                            {
                              $push: {
                                userNotification: [
                                  {
                                    Type: "Silah Alındı",
                                    Reason: `**${message.author.username}** adlı kişi'den \`${ürün.Name}\` alındı.`,
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

                          button
                            .reply({
                              content:
                                "Başarıyla satış işlemini gerçekleştirdin.",
                              ephemeral: true,
                            })
                            .catch(() => {
                              return undefined;
                            });

                          embed.setColor("GREEN");
                          embed.setDescription(
                            `Satış işlemi başarıyla tamamlandı.`
                          );
                          embed.setFooter({
                            text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Gerçekleşti.`,
                          });

                          msg
                            .edit({ embeds: [embed], components: [] })
                            .catch(() => {
                              return undefined;
                            });

                          return;
                        }
                      } catch (err) {
                        await ecoUserData
                          .findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: member.user.id,
                            },
                            { $inc: { userMoney: 0 } },
                            { upsert: true }
                          )
                          .then(() => {
                            button
                              .reply({
                                content:
                                  "Satış işlemi gerçekleştirilemedi. Sebep: Yetersiz Para",
                                ephemeral: true,
                              })
                              .catch(() => {
                                return undefined;
                              });
                          })
                          .catch(() => {
                            button
                              .reply({
                                content:
                                  "Satış işleminde bir hata bulunuyor lütfen bir yetkili ile iletişime geç.",
                                ephemeral: true,
                              })
                              .catch(() => {
                                return undefined;
                              });
                          });

                        return;
                      }
                    }

                    if (button.customId === "no") {
                      button
                        .reply({
                          content: "Satış işlemini **gerçekleştirmedin**.",
                          ephemeral: true,
                        })
                        .catch(() => {
                          return undefined;
                        });

                      embed.setColor("RED");
                      embed.setDescription(
                        `Satış işlemi başarısız tamamlanamadı.`
                      );
                      embed.setFooter({
                        text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Gerçekleşmedi.`,
                      });

                      msg
                        .edit({ embeds: [embed], components: [] })
                        .catch(() => {
                          return undefined;
                        });

                      return;
                    }
                  } else {
                    button
                      .reply({
                        content: `Bu satış işlemi senin için değil!`,
                        ephemeral: true,
                      })
                      .catch(() => {
                        return undefined;
                      });

                    return;
                  }
                });
              })
              .catch(() => {
                return undefined;
              });
          } else {
            message
              .reply({
                content:
                  "Geçersiz kullanım, belirtiğin ürün sistemde bulunmuyor.",
              })
              .catch(() => {
                return undefined;
              });

            return;
          }
        } catch (err) {
          await ecoUserData
            .findOneAndUpdate(
              {
                guildID: message.guild.id,
                userID: member.user.id,
              },
              { $set: { userAccount: false } },
              { upsert: true }
            )
            .then(() => {
              message
                .reply({
                  content:
                    "Geçersiz kullanım, belirtiğin kişi'nin hesabı bulunmuyor.",
                })
                .catch(() => {
                  return undefined;
                });
            })
            .catch(() => {
              return undefined;
            });
        }
      }

      if (args[0] === "uyuşturucu") {
        if (!message.member.roles.cache.has(meslekler.baron.sellerRoleID))
          return message
            .reply({
              content: "Geçersiz kullanım, yetkiye sahip değilsin.",
            })
            .catch(() => {
              return undefined;
            });

        if (!member)
          return message
            .reply({
              content:
                "Geçersiz kullanım, satıcağın kişiyi etiketle veya ID'sini yazmalısın.",
            })
            .catch(() => {
              return undefined;
            });

        if (!price)
          return message
            .reply({
              content: "Geçersiz kullanım, fiyat belirtmen gerekiyor.",
            })
            .catch(() => {
              return undefined;
            });

        if (!name)
          return message
            .reply({
              content:
                "Geçersiz kullanım, uyuşturucu ismi belirtmen gerekiyor.",
            })
            .catch(() => {
              return undefined;
            });

        if (price < 0)
          return message
            .reply({
              content: `Geçersiz kullanım, belirtiğin fiyat pozitif bir sayı değil.`,
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

        try {
          const memberData = await ecoUserData.findOne({
            guildID: message.guild.id,
            userID: member.user.id,
          });

          if (memberData.userAccount === false)
            return message
              .reply({
                content:
                  "Geçersiz kullanım, belirtiğin kişi'nin hesabı bulunmuyor.",
              })
              .catch(() => {
                return undefined;
              });

          let ürün =
            uyusturucuMarket[
              uyusturucuMarket.indexOf(
                uyusturucuMarket.find((x) => x.Name == name)
              )
            ];

          const embed = new MessageEmbed().setAuthor({
            name: message.guild.name,
            iconURL: message.guild.iconURL({ dynamic: true }),
          });

          if (ürün) {
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

            const row = new MessageActionRow().addComponents(
              new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("✅")
                .setCustomId("yes"),
              new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("❌")
                .setCustomId("no")
            );

            embed.setDescription(
              `${message.author} size **${
                ürün.Name
              }** adlı ürünü \`${price.toLocaleString()}\` dolara satmak istiyor kabul ediyorsanız tik butonuna basın. \n\n\`Süre: 30 saniye\``
            );
            embed.setColor("YELLOW");
            embed.setFooter({
              text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Bekleniyor.`,
            });

            await message.channel
              .send({
                content: `${member},`,
                embeds: [embed],
                components: [row],
              })
              .then(async (msg) => {
                const collector = msg.channel.createMessageComponentCollector({
                  time: 30000,
                  max: 100,
                  errors: ["time"],
                });

                collector.on("collect", async (button) => {
                  if (button.user.id === member.user.id) {
                    if (button.customId === "yes") {
                      try {
                        if (memberData.userMoney < price) {
                          button
                            .reply({
                              content:
                                "Satış işlemi gerçekleştirilemedi. Sebep: Yetersiz Para",
                              ephemeral: true,
                            })
                            .catch(() => {
                              return undefined;
                            });

                          embed.setDescription(
                            `Satış işlemi kişinin parası yetmediği için gerçekleşmedi.`
                          );
                          embed.setFooter({
                            text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Gerçekleşmedi.`,
                          });

                          msg
                            .edit({ embeds: [embed], components: [] })
                            .catch(() => {
                              return undefined;
                            });

                          return;
                        } else {
                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: message.author.id,
                            },
                            { $inc: { userMoney: price } },
                            {
                              upsert: true,
                            }
                          );

                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: member.user.id,
                            },
                            { $inc: { userMoney: -price } },
                            {
                              upsert: true,
                            }
                          );

                          await ecoUserData.findOneAndUpdate(
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
                                    sellerPrice: price,
                                    SahipName: member.user.username,
                                    SahipID: member.user.id,
                                    Type: ürün.Type,
                                  },
                                ],
                              },
                            },
                            { upsert: true }
                          );

                          await ecoGuildData.findOneAndUpdate(
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
                                    sellerPrice: price,
                                    SahipName: member.user.username,
                                    SahipID: member.user.id,
                                    Type: ürün.Type,
                                  },
                                ],
                              },
                            },
                            { upsert: true }
                          );

                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: message.author.id,
                            },
                            {
                              $push: {
                                userNotification: [
                                  {
                                    Type: "Uyuşturucu Satıldı",
                                    Reason: `**${member.user.username}** adlı kişiye \`${ürün.Name}\` satıldı.`,
                                  },
                                ],
                              },
                            },
                            { upsert: true }
                          );

                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: member.user.id,
                            },
                            {
                              $push: {
                                userNotification: [
                                  {
                                    Type: "Uyuşturucu Alındı",
                                    Reason: `**${message.author.username}** adlı kişi'den \`${ürün.Name}\` alındı.`,
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

                          button
                            .reply({
                              content:
                                "Başarıyla satış işlemini gerçekleştirdin.",
                              ephemeral: true,
                            })
                            .catch(() => {
                              return undefined;
                            });

                          embed.setColor("GREEN");
                          embed.setDescription(
                            `Satış işlemi başarıyla tamamlandı.`
                          );
                          embed.setFooter({
                            text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Gerçekleşti.`,
                          });

                          msg
                            .edit({ embeds: [embed], components: [] })
                            .catch(() => {
                              return undefined;
                            });

                          return;
                        }
                      } catch (err) {
                        await ecoUserData
                          .findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: member.user.id,
                            },
                            { $inc: { userMoney: 0 } },
                            { upsert: true }
                          )
                          .then(() => {
                            button
                              .reply({
                                content:
                                  "Satış işlemi gerçekleştirilemedi. Sebep: Yetersiz Para",
                                ephemeral: true,
                              })
                              .catch(() => {
                                return undefined;
                              });
                          })
                          .catch(() => {
                            button
                              .reply({
                                content:
                                  "Satış işleminde bir hata bulunuyor lütfen bir yetkili ile iletişime geç.",
                                ephemeral: true,
                              })
                              .catch(() => {
                                return undefined;
                              });
                          });

                        return;
                      }
                    }

                    if (button.customId === "no") {
                      button
                        .reply({
                          content: "Satış işlemini **gerçekleştirmedin**.",
                          ephemeral: true,
                        })
                        .catch(() => {
                          return undefined;
                        });

                      embed.setColor("RED");
                      embed.setDescription(
                        `Satış işlemi başarısız tamamlanamadı.`
                      );
                      embed.setFooter({
                        text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Gerçekleşmedi.`,
                      });

                      msg
                        .edit({ embeds: [embed], components: [] })
                        .catch(() => {
                          return undefined;
                        });

                      return;
                    }
                  } else {
                    button
                      .reply({
                        content: `Bu satış işlemi senin için değil!`,
                        ephemeral: true,
                      })
                      .catch(() => {
                        return undefined;
                      });

                    return;
                  }
                });
              })
              .catch(() => {
                return undefined;
              });
          } else {
            message
              .reply({
                content:
                  "Geçersiz kullanım, belirtiğin ürün sistemde bulunmuyor.",
              })
              .catch(() => {
                return undefined;
              });

            return;
          }
        } catch (err) {
          await ecoUserData
            .findOneAndUpdate(
              {
                guildID: message.guild.id,
                userID: member.user.id,
              },
              { $set: { userAccount: false } },
              { upsert: true }
            )
            .then(() => {
              message
                .reply({
                  content:
                    "Geçersiz kullanım, belirtiğin kişi'nin hesabı bulunmuyor.",
                })
                .catch(() => {
                  return undefined;
                });
            })
            .catch(() => {
              return undefined;
            });
        }
      }

      if (args[0] === "telefon") {
        if (
          !message.member.roles.cache.has(meslekler.elektronikçi.sellerRoleID)
        )
          return message
            .reply({
              content: "Geçersiz kullanım, yetkiye sahip değilsin.",
            })
            .catch(() => {
              return undefined;
            });

        if (!member)
          return message
            .reply({
              content:
                "Geçersiz kullanım, satıcağın kişiyi etiketle veya ID'sini yazmalısın.",
            })
            .catch(() => {
              return undefined;
            });

        if (!price)
          return message
            .reply({
              content: "Geçersiz kullanım, fiyat belirtmen gerekiyor.",
            })
            .catch(() => {
              return undefined;
            });

        if (!name)
          return message
            .reply({
              content: "Geçersiz kullanım, telefon ismi belirtmen gerekiyor.",
            })
            .catch(() => {
              return undefined;
            });

        if (price < 0)
          return message
            .reply({
              content: `Geçersiz kullanım, belirtiğin fiyat pozitif bir sayı değil.`,
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

        try {
          const memberData = await ecoUserData.findOne({
            guildID: message.guild.id,
            userID: member.user.id,
          });

          if (memberData.userAccount === false)
            return message
              .reply({
                content:
                  "Geçersiz kullanım, belirtiğin kişi'nin hesabı bulunmuyor.",
              })
              .catch(() => {
                return undefined;
              });

          let ürün =
            elektronikMarket[
              elektronikMarket.indexOf(
                elektronikMarket.find((x) => x.Name == name)
              )
            ];

          const embed = new MessageEmbed().setAuthor({
            name: message.guild.name,
            iconURL: message.guild.iconURL({ dynamic: true }),
          });

          if (ürün) {
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

            const row = new MessageActionRow().addComponents(
              new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("✅")
                .setCustomId("yes"),
              new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("❌")
                .setCustomId("no")
            );

            embed.setDescription(
              `${message.author} size **${
                ürün.Name
              }** adlı ürünü \`${price.toLocaleString()}\` dolara satmak istiyor kabul ediyorsanız tik butonuna basın. \n\n\`Süre: 30 saniye\``
            );
            embed.setColor("YELLOW");
            embed.setFooter({
              text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Bekleniyor.`,
            });

            await message.channel
              .send({
                content: `${member},`,
                embeds: [embed],
                components: [row],
              })
              .then(async (msg) => {
                const collector = msg.channel.createMessageComponentCollector({
                  time: 30000,
                  max: 100,
                  errors: ["time"],
                });

                collector.on("collect", async (button) => {
                  if (button.user.id === member.user.id) {
                    if (button.customId === "yes") {
                      try {
                        if (memberData.userMoney < price) {
                          button
                            .reply({
                              content:
                                "Satış işlemi gerçekleştirilemedi. Sebep: Yetersiz Para",
                              ephemeral: true,
                            })
                            .catch(() => {
                              return undefined;
                            });

                          embed.setDescription(
                            `Satış işlemi kişinin parası yetmediği için gerçekleşmedi.`
                          );
                          embed.setFooter({
                            text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Gerçekleşmedi.`,
                          });

                          msg
                            .edit({ embeds: [embed], components: [] })
                            .catch(() => {
                              return undefined;
                            });

                          return;
                        } else {
                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: message.author.id,
                            },
                            { $inc: { userMoney: price } },
                            {
                              upsert: true,
                            }
                          );

                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: member.user.id,
                            },
                            { $inc: { userMoney: -price } },
                            {
                              upsert: true,
                            }
                          );

                          await ecoUserData.findOneAndUpdate(
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
                                    sellerPrice: price,
                                    SahipName: member.user.username,
                                    SahipID: member.user.id,
                                    Type: ürün.Type,
                                  },
                                ],
                              },
                            },
                            { upsert: true }
                          );

                          await ecoGuildData.findOneAndUpdate(
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
                                    sellerPrice: price,
                                    SahipName: member.user.username,
                                    SahipID: member.user.id,
                                    Type: ürün.Type,
                                  },
                                ],
                              },
                            },
                            { upsert: true }
                          );

                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: message.author.id,
                            },
                            {
                              $push: {
                                userNotification: [
                                  {
                                    Type: "Telefon veya Telsiz Satıldı",
                                    Reason: `**${member.user.username}** adlı kişiye \`${ürün.Name}\` satıldı.`,
                                  },
                                ],
                              },
                            },
                            { upsert: true }
                          );

                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: member.user.id,
                            },
                            {
                              $push: {
                                userNotification: [
                                  {
                                    Type: "Telefon veya Telsiz Alındı",
                                    Reason: `**${message.author.username}** adlı kişi'den \`${ürün.Name}\` alındı.`,
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

                          button
                            .reply({
                              content:
                                "Başarıyla satış işlemini gerçekleştirdin.",
                              ephemeral: true,
                            })
                            .catch(() => {
                              return undefined;
                            });

                          embed.setColor("GREEN");
                          embed.setDescription(
                            `Satış işlemi başarıyla tamamlandı.`
                          );
                          embed.setFooter({
                            text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Gerçekleşti.`,
                          });

                          msg
                            .edit({ embeds: [embed], components: [] })
                            .catch(() => {
                              return undefined;
                            });

                          return;
                        }
                      } catch (err) {
                        await ecoUserData
                          .findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: member.user.id,
                            },
                            { $inc: { userMoney: 0 } },
                            { upsert: true }
                          )
                          .then(() => {
                            button
                              .reply({
                                content:
                                  "Satış işlemi gerçekleştirilemedi. Sebep: Yetersiz Para",
                                ephemeral: true,
                              })
                              .catch(() => {
                                return undefined;
                              });
                          })
                          .catch(() => {
                            button
                              .reply({
                                content:
                                  "Satış işleminde bir hata bulunuyor lütfen bir yetkili ile iletişime geç.",
                                ephemeral: true,
                              })
                              .catch(() => {
                                return undefined;
                              });
                          });

                        return;
                      }
                    }

                    if (button.customId === "no") {
                      button
                        .reply({
                          content: "Satış işlemini **gerçekleştirmedin**.",
                          ephemeral: true,
                        })
                        .catch(() => {
                          return undefined;
                        });

                      embed.setColor("RED");
                      embed.setDescription(
                        `Satış işlemi başarısız tamamlanamadı.`
                      );
                      embed.setFooter({
                        text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Gerçekleşmedi.`,
                      });

                      msg
                        .edit({ embeds: [embed], components: [] })
                        .catch(() => {
                          return undefined;
                        });

                      return;
                    }
                  } else {
                    button
                      .reply({
                        content: `Bu satış işlemi senin için değil!`,
                        ephemeral: true,
                      })
                      .catch(() => {
                        return undefined;
                      });

                    return;
                  }
                });
              })
              .catch(() => {
                return undefined;
              });
          } else {
            message
              .reply({
                content:
                  "Geçersiz kullanım, belirtiğin ürün sistemde bulunmuyor.",
              })
              .catch(() => {
                return undefined;
              });

            return;
          }
        } catch (err) {
          await ecoUserData
            .findOneAndUpdate(
              {
                guildID: message.guild.id,
                userID: member.user.id,
              },
              { $set: { userAccount: false } },
              { upsert: true }
            )
            .then(() => {
              message
                .reply({
                  content:
                    "Geçersiz kullanım, belirtiğin kişi'nin hesabı bulunmuyor.",
                })
                .catch(() => {
                  return undefined;
                });
            })
            .catch(() => {
              return undefined;
            });
        }
      }

      if (args[0] === "araba") {
        if (!message.member.roles.cache.has(meslekler.galerici.sellerRoleID))
          return message
            .reply({
              content: "Geçersiz kullanım, yetkiye sahip değilsin.",
            })
            .catch(() => {
              return undefined;
            });

        if (!member)
          return message
            .reply({
              content:
                "Geçersiz kullanım, satıcağın kişiyi etiketle veya ID'sini yazmalısın.",
            })
            .catch(() => {
              return undefined;
            });

        if (!price)
          return message
            .reply({
              content: "Geçersiz kullanım, fiyat belirtmen gerekiyor.",
            })
            .catch(() => {
              return undefined;
            });

        if (!name)
          return message
            .reply({
              content: "Geçersiz kullanım, araba ismi belirtmen gerekiyor.",
            })
            .catch(() => {
              return undefined;
            });

        if (price < 0)
          return message
            .reply({
              content: `Geçersiz kullanım, belirtiğin fiyat pozitif bir sayı değil.`,
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

        try {
          const memberData = await ecoUserData.findOne({
            guildID: message.guild.id,
            userID: member.user.id,
          });

          if (memberData.userAccount === false)
            return message
              .reply({
                content:
                  "Geçersiz kullanım, belirtiğin kişi'nin hesabı bulunmuyor.",
              })
              .catch(() => {
                return undefined;
              });

          let ürün =
            galeriMarket[
              galeriMarket.indexOf(galeriMarket.find((x) => x.Name == name))
            ];

          const embed = new MessageEmbed().setAuthor({
            name: message.guild.name,
            iconURL: message.guild.iconURL({ dynamic: true }),
          });

          if (ürün) {
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

            const row = new MessageActionRow().addComponents(
              new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("✅")
                .setCustomId("yes"),
              new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("❌")
                .setCustomId("no")
            );

            embed.setDescription(
              `${message.author} size **${
                ürün.Name
              }** adlı ürünü \`${price.toLocaleString()}\` dolara satmak istiyor kabul ediyorsanız tik butonuna basın. \n\n\`Süre: 30 saniye\``
            );
            embed.setColor("YELLOW");
            embed.setFooter({
              text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Bekleniyor.`,
            });

            await message.channel
              .send({
                content: `${member},`,
                embeds: [embed],
                components: [row],
              })
              .then(async (msg) => {
                const collector = msg.channel.createMessageComponentCollector({
                  time: 30000,
                  max: 100,
                  errors: ["time"],
                });

                collector.on("collect", async (button) => {
                  if (button.user.id === member.user.id) {
                    if (button.customId === "yes") {
                      try {
                        if (memberData.userMoney < price) {
                          button
                            .reply({
                              content:
                                "Satış işlemi gerçekleştirilemedi. Sebep: Yetersiz Para",
                              ephemeral: true,
                            })
                            .catch(() => {
                              return undefined;
                            });

                          embed.setDescription(
                            `Satış işlemi kişinin parası yetmediği için gerçekleşmedi.`
                          );
                          embed.setFooter({
                            text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Gerçekleşmedi.`,
                          });

                          msg
                            .edit({ embeds: [embed], components: [] })
                            .catch(() => {
                              return undefined;
                            });

                          return;
                        } else {
                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: message.author.id,
                            },
                            { $inc: { userMoney: price } },
                            {
                              upsert: true,
                            }
                          );

                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: member.user.id,
                            },
                            { $inc: { userMoney: -price } },
                            {
                              upsert: true,
                            }
                          );

                          await ecoUserData.findOneAndUpdate(
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
                                    sellerPrice: price,
                                    SahipName: member.user.username,
                                    SahipID: member.user.id,
                                    Type: ürün.Type,
                                  },
                                ],
                              },
                            },
                            { upsert: true }
                          );

                          await ecoGuildData.findOneAndUpdate(
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
                                    sellerPrice: price,
                                    SahipName: member.user.username,
                                    SahipID: member.user.id,
                                    Type: ürün.Type,
                                  },
                                ],
                              },
                            },
                            { upsert: true }
                          );

                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: message.author.id,
                            },
                            {
                              $push: {
                                userNotification: [
                                  {
                                    Type: "Araba Satıldı",
                                    Reason: `**${member.user.username}** adlı kişiye \`${ürün.Name}\` satıldı.`,
                                  },
                                ],
                              },
                            },
                            { upsert: true }
                          );

                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: member.user.id,
                            },
                            {
                              $push: {
                                userNotification: [
                                  {
                                    Type: "Araba Alındı",
                                    Reason: `**${message.author.username}** adlı kişi'den \`${ürün.Name}\` alındı.`,
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

                          button
                            .reply({
                              content:
                                "Başarıyla satış işlemini gerçekleştirdin.",
                              ephemeral: true,
                            })
                            .catch(() => {
                              return undefined;
                            });

                          embed.setColor("GREEN");
                          embed.setDescription(
                            `Satış işlemi başarıyla tamamlandı.`
                          );
                          embed.setFooter({
                            text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Gerçekleşti.`,
                          });

                          msg
                            .edit({ embeds: [embed], components: [] })
                            .catch(() => {
                              return undefined;
                            });

                          return;
                        }
                      } catch (err) {
                        await ecoUserData
                          .findOneAndUpdate(
                            {
                              guildID: message.guild.id,
                              userID: member.user.id,
                            },
                            { $inc: { userMoney: 0 } },
                            { upsert: true }
                          )
                          .then(() => {
                            button
                              .reply({
                                content:
                                  "Satış işlemi gerçekleştirilemedi. Sebep: Yetersiz Para",
                                ephemeral: true,
                              })
                              .catch(() => {
                                return undefined;
                              });
                          })
                          .catch(() => {
                            button
                              .reply({
                                content:
                                  "Satış işleminde bir hata bulunuyor lütfen bir yetkili ile iletişime geç.",
                                ephemeral: true,
                              })
                              .catch(() => {
                                return undefined;
                              });
                          });

                        return;
                      }
                    }

                    if (button.customId === "no") {
                      button
                        .reply({
                          content: "Satış işlemini **gerçekleştirmedin**.",
                          ephemeral: true,
                        })
                        .catch(() => {
                          return undefined;
                        });

                      embed.setColor("RED");
                      embed.setDescription(
                        `Satış işlemi başarısız tamamlanamadı.`
                      );
                      embed.setFooter({
                        text: `İşlem ${message.author.username} ve ${member.user.username} arasında. Durum: Gerçekleşmedi.`,
                      });

                      msg
                        .edit({ embeds: [embed], components: [] })
                        .catch(() => {
                          return undefined;
                        });

                      return;
                    }
                  } else {
                    button
                      .reply({
                        content: `Bu satış işlemi senin için değil!`,
                        ephemeral: true,
                      })
                      .catch(() => {
                        return undefined;
                      });

                    return;
                  }
                });
              })
              .catch(() => {
                return undefined;
              });
          } else {
            message
              .reply({
                content:
                  "Geçersiz kullanım, belirtiğin ürün sistemde bulunmuyor.",
              })
              .catch(() => {
                return undefined;
              });

            return;
          }
        } catch (err) {
          await ecoUserData
            .findOneAndUpdate(
              {
                guildID: message.guild.id,
                userID: member.user.id,
              },
              { $set: { userAccount: false } },
              { upsert: true }
            )
            .then(() => {
              message
                .reply({
                  content:
                    "Geçersiz kullanım, belirtiğin kişi'nin hesabı bulunmuyor.",
                })
                .catch(() => {
                  return undefined;
                });
            })
            .catch(() => {
              return undefined;
            });
        }
      }
    } else {
      return;
    }
  },
};
