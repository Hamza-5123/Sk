const axios = require("axios");

module.exports.config = {
  name: "hercai",
  version: "4.5.0",
  hasPermission: 0,
  credits: "Shaan Khan", 
  description: "Pollinations GET Method with Key Integration",
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

  // Language Detection
  if (userQuery.includes("pashto") || userQuery.includes("پښتو")) {
    lastScript[senderID] = "NATIVE PASHTO SCRIPT (پښتو)";
  } else if (userQuery.includes("urdu") && (userQuery.includes("script") || userQuery.includes("mein"))) {
    lastScript[senderID] = "NATIVE URDU SCRIPT (اردو)";
  } else if (userQuery.includes("hindi") || userQuery.includes("हिंदी")) {
    lastScript[senderID] = "NATIVE HINDI SCRIPT (हिंदी)";
  } else if (userQuery.includes("roman")) {
    lastScript[senderID] = "Roman Urdu";
  }

  const conversationHistory = userMemory[senderID].join("\n");

  const systemPrompt = `You are an AI by Shaan Khan. Respond in ${lastScript[senderID]}. Emojis are mandatory. Context: ${conversationHistory}`;

  // Aapki Key yahan URL ke andar convert kar di hai
  const myKey = "Sk_AYwwKm6GT1r5R0emOe21O9SNDHI7I9F9";
  
  // Naya GET URL structure aapki key ke sath
  const apiURL = `https://text.pollinations.ai/${encodeURIComponent(body)}?system=${encodeURIComponent(systemPrompt)}&model=openai&seed=${Math.floor(Math.random() * 1000)}&key=${myKey}`;

  try {
    const response = await axios.get(apiURL);
    let botReply = response.data;

    if (!botReply) throw new Error("Empty API");

    userMemory[senderID].push(`U: ${body}`, `B: ${botReply}`);
    if (userMemory[senderID].length > 6) userMemory[senderID].splice(0, 2);

    api.setMessageReaction("✅", messageID, (err) => {}, true);
    return api.sendMessage(botReply, threadID, messageID);

  } catch (error) {
    console.error("API Error:", error.message);
    api.setMessageReaction("❌", messageID, (err) => {}, true);
    return api.sendMessage("❌ Connection Error! Shaan Khan ki API key check karein ya server slow hai. ✨", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const command = args[0]?.toLowerCase();

  if (command === "on") {
    isActive = true;
    return api.sendMessage("✅ AI On!", threadID, messageID);
  } else if (command === "off") {
    isActive = false;
    return api.sendMessage("⚠️ AI Off.", threadID, messageID);
  } else if (command === "clear") {
    userMemory = {};
    lastScript = {};
    return api.sendMessage("🧹 Memory Reset!", threadID, messageID);
  }
};
