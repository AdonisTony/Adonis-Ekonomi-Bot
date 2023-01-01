const { Schema, model } = require("mongoose");

const ecoGuildData = Schema({
  _id: String,
  guildID: String,
  guildInventory: { type: Array, default: [] },
});

module.exports = model("ecoGuildData", ecoGuildData);
