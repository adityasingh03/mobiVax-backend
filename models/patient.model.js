const mongoose = require("mongoose")

const schema = mongoose.Schema

const patientsSchema = new schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    age:{
        type:String,
        require:true
    },
    aadhar:{
        type:String,
        required:true
    },
    userId:{
        type:schema.Types.ObjectId,ref:'User',required:true
    }
})

module.exports = mongoose.model("Patient",patientsSchema)