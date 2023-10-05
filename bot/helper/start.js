const { bot } = require("../bot");
const User = require("../../models/user");
const { adminKeyboard, userKeyboard } = require("../menu/keyboard");

const start = async (msg) => {
  // console.log(msg)

  const chatId = msg.from.id;

  const checkUser = await User.findOne({ chatId }).lean();

  if (!checkUser) {
    let newUser = new User({
      name: msg.from.first_name,
      chatId,
      admin: false,
      status: true,
      action: "request_contact",
    });
    await newUser.save();

    bot.sendMessage(
      chatId,
      `Assalomu aleykum hurmatli ${msg.from.first_name}.Iltimos telefon raqamingizni yuboring`,
      {
        reply_markup: {
          keyboard: [
            [
              {
                text: "Yuborish 📱",
                request_contact: true,
              },
            ],
          ],
          resize_keyboard: true,
        },
      }
    );
  } else {
    await User.findByIdAndUpdate(
      checkUser._id,
      {
        ...checkUser,
        action: "menu",
      },
      {
        new: true,
      }
    );

    bot.sendMessage(
      chatId,
      `Menyuni tanlang, ${checkUser.admin ? "Admin" : checkUser.name}`,
      {
        reply_markup: {
          keyboard: checkUser.admin ? adminKeyboard : userKeyboard,
          resize_keyboard: true,
        },
      }
    );
  }
};

const requestContact = async (msg) => {
  const chatId = msg.from.id;

  if (msg.contact && msg.contact.phone_number) {
    let user = await User.findOne({ chatId }).lean();
    console.log(user);
    if (user) {
      user.phone = msg.contact.phone_number;
      user.admin = msg.contact.phone_number === "+998332509041"; // Use strict comparison here
      user.action = "menu";

      await User.findByIdAndUpdate(user._id, user, { new: true });

      bot.sendMessage(
        chatId,
        `Menyuni tanlang, ${user.admin ? "Admin" : user.name}`,
        {
          reply_markup: {
            keyboard: user.admin ? adminKeyboard : userKeyboard,
            resize_keyboard: true,
          },
        }
      );
    } else {
      console.error("User not found for chatId:", chatId);
    }
  } else {
    console.error("No contact information found in the message:", msg);
  }
};

module.exports = { start, requestContact };
