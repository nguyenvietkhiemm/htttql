const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const accountSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    role : {
        type: Number,
        default: 1
    },
    tokenUser:  {
        type : String,
        default: generate.generateRandomString(20),
    },
    phone: String,
    status: {
        type: String,
        default: "active",
    },
    deleted : {
        type : Boolean,
        default : false
    },
    deletedAt : Date
},
{
    timestamps : true,
}); 

const Account = mongoose.model("Account",accountSchema, "accounts");

module.exports = Account;


