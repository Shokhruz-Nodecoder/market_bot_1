const { bot } = require("../bot");
const User = require("../../models/user");
const { adminKeyboard, userKeyboard } = require("../menu/keyboard");

const Category = require("../../models/category.model");

const get_all_categories = async (chatId, page = 1) => {
  // const chatId = msg.from.id;
  let user = await User.findOne({ chatId }).lean();

  let limit = 5;
  let skip = (page - 1) * limit;

  let categories = await Category.find().skip(skip).limit(limit).lean();

  let list = categories.map((category) => [
    {
      text: category.title,
      callback_data: `category_${category._id}`,
    },
  ]);



  bot.sendMessage(chatId, "Kategoriyalar ro`yxati", {
    reply_markup: {
      remove_keyboard: true,
      inline_keyboard: [
        ...list,
        [
          {
            text: "Ortga",
            callback_data: page > 1 ? "prev_category" : page,
          },
          {
            text: page,
            callback_data: "0",
          },
          {
            text: "Keyingisi",
            callback_data: limit == categories.length ? "next_category" : page,
          },
        ],
        user.admin
          ? [
              {
                text: "Yangi Kategoriya",
                callback_data: "add_category",
              },
            ]
          : [],
      ],
    },
  });
};

const add_category = async (chatId) => {
  try {
    let user = await User.findOne({ chatId }).lean();

    if (user.admin) {
      await User.findByIdAndUpdate(
        user._id,
        {
          ...user,
          action: "add_category",
        },
        { new: true }
      );

      bot.sendMessage(chatId, "Yangi Kategoriya nomini kiriting");
    } else {
      bot.sendMessage(
        chatId,
        "Sizga bunday so`rov mumkin emas, chunki siz Admin emassiz!"
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const newCategory = async (msg) => {
  try {
    const chatId = msg.from.id;
    const text = msg.text;
    const user = await User.findOne({ chatId }).lean();
    if (user.admin && user.action === "add_category") {
      let newCategory = new Category({
        title: text,
      });
      await newCategory.save();

      await User.findByIdAndUpdate(user._id, {
        ...user,
        action: "category",
      });

      get_all_categories(chatId);
    }
    // else {
    //   bot.sendMessage(
    //       chatId,
    //       "Sizga bunday so`rov mumkin emas, chunki siz Admin emassiz! akaaa"
    //     );
    // }
  } catch (error) {
    console.log(error);
  }
};

const paginationCategory = async (chatId, action) => {
  let user = await User.findOne({ chatId }).lean();
  let page = 1;

  if (user.action.includes("category-")) {
    page = +user.action.split("-")[1];
    console.log(page)
    if (action == "prev_category" && page > 1) {
      page--;
    }
    if (action == "next_category") {
      page++;
    }
  }

  await User.findByIdAndUpdate(
    user._id,
    { ...user, action: `category-${page}` },
    { new: true }
  );

  get_all_categories(chatId, page);
};

const show_category = async (chatId, id)=>{
    const category = await Category.findById(id).lean()
    console.log(category)
}

module.exports = {
  get_all_categories,
  add_category,
  newCategory,
  paginationCategory,
  show_category
};
