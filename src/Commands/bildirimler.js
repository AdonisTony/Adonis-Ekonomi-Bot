const { MessageEmbed } = require("discord.js");
const ecoUserData = require("../Models/ecoUserData");

module.exports = {
  name: "bildirimler",
  aliases: [],
  description: "Gelen bildirimlerinizi görmenize yarayan bir sistem",
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
            content: `Geçersiz kullanım, bildirimlerinize bakmak için bir telefonunuz olmalı.`,
          })
          .catch(() => {
            return undefined;
          });

      let embedList =
        memberData &&
        memberData.userNotification
          .map(
            (data) =>
              `Bildirim İsmi: **${data.Type}** \nBildirim Açıklaması: ${data.Reason} \n`
          )
          .join("\n");

      let textList =
        memberData &&
        memberData.userNotification
          .map(
            (data) =>
              `Bildirim İsmi: ${data.Type} \nBildirim Açıklaması: ${data.Reason} \n`
          )
          .join("\n");

      const embed = new MessageEmbed()
        .setTitle("Bildirimleriniz Listelendi")
        .setColor("RANDOM")
        .setDescription(embedList || `Hiç bir bildiriminiz bulunmamaktadır.`)
        .setThumbnail(message.guild.iconURL({ dyanmic: true }))
        .setFooter({
          text: `${message.author.username} tarafından istendi.`,
          iconURL: message.author.avatarURL({ dynamic: true }),
        })
        .setTimestamp();
      message.reply({ embeds: [embed] }).catch(() => {
        const files = "./bildirimler.txt";
        const content = "\u200B";

        fs.writeFileSync(files, content);

        const cs = fs.readFileSync("bildirimler.txt", "utf-8");
        fs.writeFileSync("bildirimler.txt", textList + cs);
        const uwu = fs.readFileSync("bildirimler.txt");
        const attachment = new MessageAttachment(uwu, "bildirimler.txt");

        message
          .reply({
            content: `${message.author}, mesaj sığmadığı için dosya olarak gönderdim!`,
            files: [attachment],
          })
          .catch(() => {
            return undefined;
          });

        setTimeout(() => {
          fs.unlinkSync("bildirimler.txt");
        }, 1000);

        return;
      });

      return;
    } catch (err) {
      message
        .reply({
          content: `Geçersiz kullanım, bildirimlerinize bakmak için hesabınız olmalı.`,
        })
        .catch(() => {
          return undefined;
        });

      return;
    }
  },
};
