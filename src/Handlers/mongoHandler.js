const { MongoDB_ConnectURL } = require("../Configs/botConfig");
const mongoose = require("mongoose");

mongoose
  .connect(MongoDB_ConnectURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    console.log("Error: " + err);
  });
