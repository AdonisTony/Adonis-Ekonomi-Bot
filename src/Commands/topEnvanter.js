const { MessageEmbed, MessageAttachment } = require("discord.js");
const ecoGuildData = require("../Models/ecoGuildData");
const fs = require("fs");
const { ownerRolesID } = require("../Configs/ecoConfig");

module.exports = {
  name: "top-envanter",
  aliases: [],
  description:
    "Top envanter genel olarak bütün kişilerin envanterini sıralayan bir sistem.",
  guildOnly: true,
  category: "Üye",
  async execute(message, args, bot) {
    if (!ownerRolesID.some((x) => message.member.roles.cache.has(x))) return;

    var guildData = await ecoGuildData.findOne({ guildID: message.guild.id });

    var embedList =
      guildData &&
      guildData.guildInventory
        .map(
          (x) =>
            `\`\`\`ID: ${x.ID} \nİsim: ${x.Name} \nAçıklama: ${
              x.Description
            } \nFiyat: ${x.realPrice.toLocaleString()}, (Satıcı Fiyat: ${
              x.sellerPrice ? x.sellerPrice.toLocaleString() : `Bulunamadı.`
            }) \nSahip: ${x.SahipName} (${x.SahipID}) \nMarket: ${x.Type}\`\`\``
        )
        .join("\n");

    var textList =
      guildData &&
      guildData.guildInventory
        .filter((x) => message.guild.members.cache.has(x.SahipID))
        .map(
          (x) =>
            `ID: ${x.ID} \nİsim: ${x.Name} \nAçıklama: ${
              x.Description
            } \nFiyat: ${x.realPrice.toLocaleString()}, (Satıcı Fiyat: ${
              x ? x.sellerPrice : `Bulunamadı.`
            }) \nSahip: ${x.SahipName} (${x.SahipID}) \nMarket: ${x.Type} \n`
        )
        .join("\n");

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.guild.name} adlı sunucu top envanter sıralaması`,
        iconURL: message.guild.iconURL({ dynamic: true }),
      })
      .setColor("RANDOM")
      .setDescription(
        embedList || `Top envanter sistemini listelicek veri bulunamadı.`
      );
    message.reply({ embeds: [embed] }).catch(() => {
      const files = "./topEnvanter.txt";
      const content = "\u200B";

      fs.writeFileSync(files, content);

      const cs = fs.readFileSync("topEnvanter.txt", "utf-8");
      fs.writeFileSync("topEnvanter.txt", textList + cs);
      const uwu = fs.readFileSync("topEnvanter.txt");
      const attachment = new MessageAttachment(uwu, "topEnvanter.txt");

      message
        .reply({
          content: `${message.author}, mesaj sığmadığı için dosya olarak gönderdim!`,
          files: [attachment],
        })
        .catch(() => {
          return undefined;
        });

      setTimeout(() => {
        fs.unlinkSync("topEnvanter.txt");
      }, 1000);

      return;
    });
  },
};
