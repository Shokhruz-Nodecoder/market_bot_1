const express = require("express");
const mongoose = require("mongoose");
const app = express();

const TELEGRAM_BOT = require("node-telegram-bot-api");
require("dotenv").config();

app.use(express.json());
require("./bot/bot")    


async function bootstrapt() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
    }).then(()=>{
        console.log("Mongoose Connect")
    }).catch((error)=>{
        console.log(error)
    })
    
    app.listen(process.env.PORT, ()=>{
        console.log("Server listening on port " + process.env.PORT)
    });
  } catch (error) {
    // console.log("123123")
    console.log(error);
  }
}
bootstrapt()
