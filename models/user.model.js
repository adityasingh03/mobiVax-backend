const mongoose = require("mongoose")

const schema = mongoose.Schema

const userSchema = new schema({
    mobileNo:{
        type:String,
        unique:true,
        required:true
    }
})

module.exports = mongoose.model("User",userSchema)