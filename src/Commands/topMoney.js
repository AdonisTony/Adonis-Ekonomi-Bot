const { MessageEmbed, MessageAttachment } = require("discord.js");
const ecoUserData = require("../Models/ecoUserData");
const fs = require("fs");
const { ownerRolesID } = require("../Configs/ecoConfig");

module.exports = {
  name: "top-money",
  aliases: [],
  description:
    "Top money genel olarak bütün kişilerin paralarını sıralayan bir sistem.",
  guildOnly: true,
  category: "Üye",
  async execute(message, args, bot) {
    if (!ownerRolesID.some((x) => message.member.roles.cache.has(x))) return;

    var guildData = await ecoUserData
      .find({ guildID: message.guild.id })
      .sort({ userMoney: -1 });

    var arr = [];
    guildData.forEach((x) => {
      arr.push({ userID: x.userID, money: x.userMoney });
    });

    const embedList = guildData
      .filter(
        (x) => message.guild.members.cache.has(x.userID) && x.userMoney > 0
      )
      .map(
        (x, index) =>
          `\`${index + 1}.\` <@!${x.userID}> \`(${x.userID})\`  (**${
            x.userMoney
          }** Dolar)`
      )
      .join("\n");

    const textList = guildData
      .filter(
        (x) => message.guild.members.cache.has(x.userID) && x.userMoney > 0
      )
      .map((x, index) => `${index + 1}. <@!${x.userID}> (${x.userMoney} Dolar)`)
      .join("\n");

    var embed = new MessageEmbed()
      .setAuthor({
        name: `${message.guild.name} adlı sunucu top money sıralaması`,
        iconURL: message.guild.iconURL({ dynamic: true }),
      })
      .setColor("RANDOM")
      .setDescription(
        `${embedList || `Top envanter sistemini listelicek veri bulunamadı.`}`
      );
    message.reply({ embeds: [embed] }).catch(() => {
      const files = "./topMoney.txt";
      const content = "\u200B";

      fs.writeFileSync(files, content);

      const cs = fs.readFileSync("topMoney.txt", "utf-8");
      fs.writeFileSync("topMoney.txt", textList + cs);
      const uwu = fs.readFileSync("topMoney.txt");
      const attachment = new MessageAttachment(uwu, "topMoney.txt");

      message
        .reply({
          content: `${message.author}, mesaj sığmadığı için dosya olarak gönderdim!`,
          files: [attachment],
        })
        .catch(() => {
          return undefined;
        });

      setTimeout(() => {
        fs.unlinkSync("topMoney.txt");
      }, 1000);

      return;
    });
  },
};
