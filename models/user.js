const {Schema, model} = require("mongoose")

const UserSchema = new Schema({
    name : String,
    chatId : Number,
    phone : String,
    admin : {
        type : Boolean,
        default : false
    },
    action : String,
    status : {
        type : Boolean,
        default : true
    }
},{
    timestamps : true
})

module.exports = model("User", UserSchema)