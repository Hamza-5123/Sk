const request = require('request');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "welcome",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "SHAAN",
    description: "Funny welcome GIFs on specific keywords",
    usePrefix: false,
    commandCategory: "No command marks needed",
    usages: "wlm / thanks",
    cooldowns: 5,
};

const gifs = [
    "https://i.imgur.com/8v6L073.gif", // Funny dancing baby
    "https://i.imgur.com/8mAn98X.gif", // Minion welcome
    "https://i.imgur.com/scS6m5S.gif", // Funny bear wave
    "https://i.imgur.com/f9m9S76.gif", // Cat welcome
    "https://i.imgur.com/708X8Xp.gif"  // Dog high five
];

const messages = [
    "=𝐎𝐰𝐧𝐞𝐫 ➻  💐𝐒𝐇𝐀𝐀𝐍💐 \n──────────────────\n\n🙋  🅆🄴🄻🄲🄾🄼🄴  🙋\n",
    "=𝐎𝐰𝐧𝐞𝐫 ➻  💐𝐒𝐇𝐀𝐀𝐍💐 \n──────────────────\n\n😜 𝑴𝒐𝒋 𝑲𝒂𝒓𝒐... 𝑾𝒆𝒍𝒄𝒐𝒎𝒆! 😜\n",
    "=𝐎𝐰𝐧𝐞𝐫 ➻  💐𝐒𝐇𝐀𝐀𝐍💐 \n──────────────────\n\n💖 𝒀𝒐𝒖'𝒓𝒆 𝑾𝒆𝒍𝒄𝒐𝒎𝒆, 𝑱𝒂𝒂𝒏𝒊! 💖\n",
    "=𝐎𝐰𝐧𝐞𝐫 ➻  💐𝐒𝐇𝐀𝐀𝐍💐 \n──────────────────\n\n🙏 𝑺𝒉𝒖𝒌𝒓𝒊𝒚𝒂 𝑲𝒊 𝑲𝒐𝒊 𝒁𝒂𝒓𝒖𝒓𝒂𝒕 𝑵𝒂𝒉𝒊 🙏\n"
];

module.exports.handleEvent = async function({ api, event, Users }) {
    var { threadID, messageID, body } = event;
    if (!body) return;

    const input = body.toLowerCase();
    const keywords = ["wlm", "thanks", "thankyou", "thank you"];

    if (keywords.some(word => input.startsWith(word))) {
        var name = await Users.getNameUser(event.senderID);
        
        // Select random GIF and message
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const downloadPath = path.join(__dirname, 'cache', `welcome-${event.senderID}.gif`);

        // Ensure cache folder exists
        if (!fs.existsSync(path.join(__dirname, 'cache'))) {
            fs.mkdirSync(path.join(__dirname, 'cache'));
        }

        // Download and Send
        request(randomGif).pipe(fs.createWriteStream(downloadPath)).on('close', () => {
            var msg = {
                body: randomMessage,
                attachment: fs.createReadStream(downloadPath)
            };
            api.sendMessage(msg, threadID, () => {
                // Delete file after sending to keep storage clean
                if (fs.existsSync(downloadPath)) fs.unlinkSync(downloadPath);
            }, messageID);
            api.setMessageReaction("😇", messageID, (err) => {}, true);
        });
    }
}

module.exports.run = function() {}
