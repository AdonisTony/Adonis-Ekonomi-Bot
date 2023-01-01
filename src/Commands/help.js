const { MessageEmbed } = require("discord.js");
const { Prefix } = require("../Configs/botConfig");
const { ownerRolesID } = require("../Configs/ecoConfig");

module.exports = {
  name: "help",
  aliases: [],
  description: "Kişilerin kullanabileceği yardım komutu.",
  guildOnly: true,
  async execute(message, args, bot) {
    if (!args[0]) {
      const embed = new MessageEmbed()
        .setTitle("Yardım Komutları Listelendi")
        .setColor("RANDOM")
        .setDescription(
          `${bot.commands
            .filter((x) => x.category === "Üye")
            .map(
              (value) => `\`•\` **${Prefix}${value.name}** ${value.description}`
            )
            .join("\n")}`
        )
        .setFooter({
          text: `${message.author.username} tarafından istendi.`,
          iconURL: message.author.avatarURL({ dynamic: true }),
        })
        .setTimestamp();
      message.reply({ embeds: [embed] }).catch(() => {
        return undefined;
      });
    }

    if (args[0] === "owner") {
      if (!ownerRolesID.some((x) => message.member.roles.cache.has(x))) return;

      const embed = new MessageEmbed()
        .setTitle("Owner Yardım Komutları Listelendi")
        .setColor("RANDOM")
        .setDescription(
          `${bot.commands
            .filter((x) => x.category === "Owner")
            .map(
              (value) => `\`•\` **${Prefix}${value.name}** ${value.description}`
            )
            .join("\n")}`
        )
        .setFooter({
          text: `${message.author.username} tarafından istendi.`,
          iconURL: message.author.avatarURL({ dynamic: true }),
        })
        .setTimestamp();
      message.reply({ embeds: [embed] }).catch(() => {
        return undefined;
      });
    }
  },
};
