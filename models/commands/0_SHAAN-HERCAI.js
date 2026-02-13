const axios = require("axios");

module.exports.config = {
  name: "hercai",
  version: "6.0.0",
  hasPermission: 0,
  credits: "Shaan Khan", 
  description: "Pollinations Stable No-Key Fix",
  commandCategory: "AI",
  usePrefix: false,
  usages: "[Reply to bot]",
  cooldowns: 2,
};

let userMemory = {};
let lastScript = {}; 
let isActive = true;

module.exports.handleEvent = async function ({ api, event }) {
  if (this.config.credits !== "Shaan Khan") {
    return api.sendMessage("⚠️ Error: Credits changed. Creator: Shaan Khan", event.threadID, event.messageID);
  }

  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!isActive || !body) return;
  if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

  api.setMessageReaction("⌛", messageID, (err) => {}, true);

  const userQuery = body.toLowerCase();
  if (!userMemory[senderID]) userMemory[senderID] = [];
  if (!lastScript[senderID]) lastScript[senderID] = "Roman Urdu";

  // Script detection
  if (userQuery.includes("pashto") || userQuery.includes("پښتو")) {
    lastScript[senderID] = "NATIVE PASHTO SCRIPT (پښتو)";
  } else if (userQuery.includes("urdu") && (userQuery.includes("script") || userQuery.includes("mein"))) {
    lastScript[senderID] = "NATIVE URDU SCRIPT (اردو)";
  } else if (userQuery.includes("hindi") || userQuery.includes("हिंदी")) {
    lastScript[senderID] = "NATIVE HINDI SCRIPT (हिंदी)";
  } else if (userQuery.includes("roman")) {
    lastScript[senderID] = "Roman Urdu";
  }

  const history = userMemory[senderID].join("\n");
  
  // Strict System Prompt
  const sys = `You are an AI by Shaan Khan. Respond ONLY in ${lastScript[senderID]}. Use emojis. Context: ${history}`;

  // Sabse Stable URL Structure (GET Method)
  // Pollinations ab 'system' ko query parameter mein support karta hai
  const apiURL = `https://text.pollinations.ai/${encodeURIComponent(body)}?model=mistral&system=${encodeURIComponent(sys)}`;

  try {
    const response = await axios.get(apiURL);
    let botReply = response.data;

    if (!botReply || botReply === "") throw new Error("API Khali Hai");

    userMemory[senderID].push(`U: ${body}`, `B: ${botReply}`);
    if (userMemory[senderID].length > 6) userMemory[senderID].splice(0, 2);

    api.setMessageReaction("✅", messageID, (err) => {}, true);
    return api.sendMessage(botReply, threadID, messageID);

  } catch (error) {
    console.error("Hercai Error:", error.message);
    api.setMessageReaction("❌", messageID, (err) => {}, true);
    
    // Last Hope: Very Simple Backup URL
    try {
      const backupURL = `https://text.pollinations.ai/${encodeURIComponent(body)}?model=search`;
      const res = await axios.get(backupURL);
      return api.sendMessage(res.data + " ✨", threadID, messageID);
    } catch (e) {
      return api.sendMessage("❌ Connection ka bohot zyada masla hai. Apka internet ya hosting check karein. ✨", threadID, messageID);
    }
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const command = args[0]?.toLowerCase();

  if (command === "on") {
    isActive = true;
    return api.sendMessage("✅ AI Online! Bolna shuru karein. 🎭", threadID, messageID);
  } else if (command === "off") {
    isActive = false;
    return api.sendMessage("⚠️ AI Offline.", threadID, messageID);
  } else if (command === "clear") {
    userMemory = {};
    lastScript = {};
    return api.sendMessage("🧹 Sab saaf! Reset ho gaya. ✨", threadID, messageID);
  }
};
