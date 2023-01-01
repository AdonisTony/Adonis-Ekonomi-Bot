const { Playing, Status } = require("../Configs/botConfig");
const {
  guildID,
  meslekler,
  telefonChannelID,
} = require("../Configs/ecoConfig");
const ecoUserData = require("../Models/ecoUserData");

module.exports = async (bot) => {
  bot.user.setPresence({
    activities: [{ name: Playing }],
    status: Status,
  });

  const guild = bot.guilds.cache.get(guildID);

  setInterval(() => {
    if (guild) {
      guild.members.cache.forEach(async (members) => {
        if (members) {
          // ceza kes otomatik para kesme sistemi baslangic \\
          const memberData = await ecoUserData.findOne({
            guildID: guild.id,
            userID: members.id,
          });

          const punishmentUserID =
            memberData &&
            memberData.userPunishment.map((x) => x.punishmentUserID);

          const user = guild.members.cache.get(
            punishmentUserID && punishmentUserID[0]
          );

          if (user) {
            const devletBaskani = guild.roles.cache.get(
              meslekler.devletBaşkanı.roleID
            );

            const telefonChannel = guild.channels.cache.get(telefonChannelID);

            if (devletBaskani) {
              const punishmentData = await ecoUserData.findOne({
                guildID: guild.id,
                userID: user.id,
              });

              const punishmentMoney = punishmentData.userPunishment.map(
                (c) => c.punishmentMoney
              );

              let random =
                punishmentMoney[
                  Math.floor(Math.random() * punishmentMoney.length)
                ];

              if (punishmentData && punishmentData.userMoney >= random) {
                await ecoUserData
                  .findOneAndUpdate(
                    {
                      guildID: guild.id,
                      userID: user.id,
                    },
                    {
                      $pull: {
                        userPunishment: {
                          punishmentUserID: user.id,
                          punishmentMoney: random,
                        },
                      },
                    },
                    { upsert: true }
                  )
                  .then(async () => {
                    await ecoUserData
                      .findOneAndUpdate(
                        { guildID: guild.id, userID: user.id },
                        { $inc: { userMoney: -random } },
                        { upsert: true }
                      )
                      .then(async () => {
                        devletBaskani.members.forEach(async (member) => {
                          await ecoUserData.findOneAndUpdate(
                            { guildID: guild.id, userID: member.id },
                            { $inc: { userMoney: random } },
                            { upsert: true }
                          );

                          await ecoUserData.findOneAndUpdate(
                            {
                              guildID: guild.id,
                              userID: member.id,
                            },
                            {
                              $push: {
                                userNotification: [
                                  {
                                    Type: "Ceza Kesilme Ödendi",
                                    Reason: reason,
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
                        });
                      });
                  });
              }
            }
          }
          // ceza kes otomatik para kesme sistemi bitis \\
        }
      });
    }
  }, 10000);
};

module.exports.conf = {
  name: "ready",
};
