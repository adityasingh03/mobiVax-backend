const mongoose = require("mongoose")

const schema = mongoose.Schema

const staffSchema = new schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("Staff",staffSchema)