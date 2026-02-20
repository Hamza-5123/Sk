const fs = require("fs");
module.exports.config = {
  name: "chocolate",
    version: "1.1.1",
  hasPermssion: 0,
  credits: "SHAAN KHAN", 
  description: "Just Respond",
  commandCategory: "no prefix",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  let react = event.body.toLowerCase();
  if(react.includes("chocolate") ||
     react.includes("Chocolate") || react.includes("CHOCOLATE") || react.includes("chocolate") ||
react.includes("Chocolate") ||
react.includes("CHOCOLATE")) {
    var msg = {
        body: `𝐁𝐀𝐁𝐔 𝐂𝐇𝐎𝐂𝐎𝐋𝐀𝐓𝐄 𝐊𝐇𝐀 𝐋𝐎 🍫`,attachment: fs.createReadStream(__dirname + `/SHAN-KHAN/CHOCOLATE.jpeg`)
      }
      api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🍫", event.messageID, (err) => {}, true)
    }
  }
  module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
