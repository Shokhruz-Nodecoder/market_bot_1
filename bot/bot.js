const TELEGRAM_BOT = require("node-telegram-bot-api");

const opt = {polling : true}
const bot = new TELEGRAM_BOT(process.env.TOKEN,{polling : true});

bot.on('polling_error', (error) => {
    console.log(error);  // => 'EFATAL'
  });






module.exports = {bot}
require("./message")
require("./query")
