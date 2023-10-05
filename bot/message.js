const User = require("../models/user");
const { bot } = require("./bot");
const { get_all_categories, newCategory } = require("./helper/category");
const { start, requestContact } = require("./helper/start");
const { getUsers } = require("./helper/users");

bot.on("message", async (msg) => {
  const chatId = msg.from.id;
  const text = msg.text;

  const user = await User.findOne({ chatId }).lean();
  if (text === "/start") {
    start(msg);
  }

  if (user) {
    if ((user.action = "request_contact" && !user.phone)) {
      requestContact(msg);
    }

    if (text === "Foydalanuvchilar") {
      getUsers(msg);
    }

    if (text === "Katalog") {
      get_all_categories(chatId);
    }

    if ((user.action = "add_category")) newCategory(msg);
  }
});
