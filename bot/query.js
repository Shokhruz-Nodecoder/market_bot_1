const { bot } = require("./bot");
const User = require("../models/user");
const { add_category, paginationCategory, show_category } = require("./helper/category");

bot.on("callback_query", async (query) => {
  const chatId = query.from.id;
  const { data } = query;

  // console.log(data)
  if (data === "add_category") {
    add_category(chatId);
  }

  if(data === 'next_category'){
    paginationCategory(chatId,data)
  }
  if(data === 'prev_category'){
    paginationCategory(chatId,data)
  }

  if(data.includes('category_')){
    const id = data.split('_')[1];
    console.log(id)
    show_category(chatId, id)
  }
});
