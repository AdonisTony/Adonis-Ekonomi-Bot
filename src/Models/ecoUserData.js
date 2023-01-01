const { Schema, model } = require("mongoose");

const ecoUserData = Schema({
  _id: String,
  guildID: String,
  userID: String,
  userAccount: { type: Boolean, default: false },
  userMoney: { type: Number, default: 0 },
  userInventory: { type: Array, default: [] },
  userPunishment: { type: Array, default: [] },
  userNotification: { type: Array, default: [] },
});

module.exports = model("ecoUserData", ecoUserData);
