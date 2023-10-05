const { bot } = require("../bot");
const User = require("../../models/user");
const { adminKeyboard, userKeyboard } = require("../menu/keyboard");

const getUsers = async (msg) => {
  try {
    const chatId = msg.from.id;
    let user = await User.findOne({ chatId }).lean();

    if (user.admin) {
      const users = await User.find().lean();

      let list = " ";
      users.forEach((user) => {
        list += `${user.name}:${user.chatId}\n`;
      });
      bot.sendMessage(
        chatId,
        `Foydalanuchilar ro'yxati :
${list}
      `
      );
    } else {
      bot.sendMessage(
        chatId,
        "Sizga bunday so`rov mumkin emas, chunki siz Admin emassiz!",
        {
          reply_markup: {
            keyboard: userKeyboard,
            resize_keyboard: true,
          },
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUsers,
};
