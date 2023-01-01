const { MessageEmbed } = require("discord.js");
const {
  polisChannelID,
  meslekler,
  ambulansChannelID,
  yardımMerkeziChannelID,
} = require("../Configs/ecoConfig");
const ecoUserData = require("../Models/ecoUserData");

const { ambulans, polis } = require("../Configs/emotes");

module.exports = {
  name: "ara",
  aliases: [],
  description:
    "Polis, ambulans ve yardım merkezini arayabileceğiniz bir sistem.",
  guildOnly: true,
  category: "Üye",
  async execute(message, args, bot) {
    const memberData = await ecoUserData.findOne({
      guildID: message.guild.id,
      userID: message.author.id,
    });

    const reason = args.slice(1).join(" ");

    const polisChannel = message.guild.channels.cache.get(polisChannelID);
    const ambulansChannel = message.guild.channels.cache.get(ambulansChannelID);
    const yardımMerkeziChannel = message.guild.channels.cache.get(
      yardımMerkeziChannelID
    );

    try {
      if (memberData.userAccount === false)
        return message
          .reply({
            content: `Geçersiz kullanım, polisi aramak için bir hesabının olması gerekiyor.`,
          })
          .catch(() => {
            return undefined;
          });

      let datas = memberData.userInventory.map((z) => z.Type);

      if (!datas.includes("Elektronik Market"))
        return message
          .reply({
            content: `Telefonun veya telsizin yok bu işlemi gerçekleştiremezsin.`,
          })
          .catch(() => {
            return undefined;
          });

      if (args[0] === "polis") {
        if (!reason)
          return message
            .reply({
              content: `Geçersiz kullanım, polisi aramak için bir neden belirtmelisin.`,
            })
            .catch(() => {
              return undefined;
            });

        const embed = new MessageEmbed()
          .setColor("RED")
          .setDescription(
            `${
              message.author
            } ***adlı kişi polisi arıyor*** ${message.guild.emojis.cache.get(
              polis
            )} \n\n***Nedeni:*** *${reason}*`
          );

        polisChannel
          .send({
            content: `<@&${meslekler.polis.roleID}>,`,
            embeds: [embed],
          })
          .catch(() => {
            return undefined;
          });

        message
          .reply({
            content: `Merhaba, başarıyla hizmetimize bağlandınız en kısa sürede ekip otosu gönderiyoruz, iyi günler dileriz. ${message.guild.emojis.cache.get(
              polis
            )}`,
          })
          .catch(() => {
            return undefined;
          });

        return;
      }

      if (args[0] === "ambulans") {
        if (!reason)
          return message
            .reply({
              content: `Geçersiz kullanım, ambulansı aramak için bir neden belirtmelisin.`,
            })
            .catch(() => {
              return undefined;
            });

        const embed = new MessageEmbed()
          .setColor("RED")
          .setDescription(
            `${
              message.author
            } ***adlı kişi ambulansı arıyor!*** ${message.guild.emojis.cache.get(
              ambulans
            )} \n\n***Nedeni:*** *${reason}*`
          );

        ambulansChannel
          .send({
            content: `<@&${meslekler.doktor.roleID}>,`,
            embeds: [embed],
          })
          .catch(() => {
            return undefined;
          });

        message
          .reply({
            content: `Merhaba, hizmetimize bağlandınız en kısa sürede ambulans ekibi gönderiyoruz, iyi günler dileriz. ${message.guild.emojis.cache.get(
              ambulans
            )}`,
          })
          .catch(() => {
            return undefined;
          });

        return;
      }

      if (args[0] === "yardım-merkezi") {
        if (!reason)
          return message
            .reply({
              content: `Geçersiz kullanım, yardım merkezini aramak için bir neden belirtmelisin.`,
            })
            .catch(() => {
              return undefined;
            });

        const embed = new MessageEmbed()
          .setColor("RED")
          .setDescription(
            `${
              message.author
            } ***adlı kişi yardım merkezini arıyor!*** ${message.guild.emojis.cache.get(
              ambulans,
              ambulans
            )} \n\n***Nedeni:*** *${reason}*`
          );

        yardımMerkeziChannelID.map((x) => {
          let kanal = message.guild.channels.cache.get(x);

          kanal
            .send({
              content: `<@&${meslekler.doktor.roleID}>, <@&${meslekler.polis.roleID}>`,
              embeds: [embed],
            })
            .catch(() => {
              return undefined;
            });
        });

        message
          .reply({
            content: `Merhaba, hizmetimize bağlandınız en kısa sürede ambulans ve ekip otosu gönderiyoruz, iyi günler dileriz.`,
          })
          .catch(() => {
            return undefined;
          });

        return;
      }
    } catch (err) {
      message.reply({
        content: `Geçersiz kullanım, polisi aramak için bir hesabının olması gerekiyor.`,
      });

      return;
    }
  },
};
