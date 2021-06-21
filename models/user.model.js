const mongoose = require("mongoose")

const schema = mongoose.Schema

const userSchema = new schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    mobileNo:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    }
})

module.exports = mongoose.model("User",userSchema)