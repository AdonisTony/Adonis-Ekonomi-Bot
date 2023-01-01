const { MessageEmbed } = require("discord.js");
const { meslekler, ownerUsersID } = require("../Configs/ecoConfig");
const ecoUserData = require("../Models/ecoUserData");

module.exports = {
  name: "maaş-yatır",
  aliases: [],
  description:
    "Maaş yatır belirlediğiniz bir role maaş yatırmaya yarayan bir sistem.",
  guildOnly: true,
  category: "Üye",
  async execute(message, args, bot) {
    const role =
      message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

    const money = Number(args[1]);

    if (
      !message.member.roles.cache.has(meslekler.banka.officerRoleID) &&
      !ownerUsersID.includes(message.author.id)
    )
      return;

    if (!role)
      return message
        .reply({
          content: `Geçersiz kullanım, bir rol belirtmen gerekiyor.`,
        })
        .catch(() => {
          return undefined;
        });

    if (!money)
      return message
        .reply({
          content: `Geçersiz kullanım, bir miktar belirtmen gerekiyor.`,
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

    if (
      message.guild.members.cache.filter((member) =>
        member.roles.cache.has(role.id)
      ).size === 0
    )
      return message
        .reply({
          content: "Mesleğe sahip kişi olmadığı için maaş verilmedi.",
        })
        .catch(() => {
          return undefined;
        });

    role.members.forEach(async (member) => {
      await ecoUserData.findOneAndUpdate(
        { guildID: message.guild.id, userID: member.id },
        { $inc: { userMoney: money } },
        { upsert: true }
      );

      await ecoUserData.findOneAndUpdate(
        { guildID: message.guild.id, userID: member.id },
        {
          $push: {
            userNotification: [
              {
                Type: "Maaş",
                Reason: `\`${money}\` dolar maaş geldi.`,
              },
            ],
          },
        },
        { upsert: true }
      );
    });

    const embed = new MessageEmbed()
      .setAuthor({
        name: message.guild.name,
        iconURL: message.guild.iconURL({ dynamic: true }),
      })
      .setColor("RANDOM")
      .setDescription(
        `**${
          role.name
        }** adlı mesleğe sahip herkese \`${money.toLocaleString()}\` dolar maaş verilmiştir iyi kullanımlar dileriz. \n\nMesleğe Sahip Kişi Sayısı: (\`${
          message.guild.members.cache.filter((member) =>
            member.roles.cache.has(role.id)
          ).size
        }\`)`
      );

    message.reply({ embeds: [embed] }).catch(() => {
      return undefined;
    });
  },
};
