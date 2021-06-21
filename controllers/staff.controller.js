const Staff = require("../models/staff.model");
const jwt = require("jsonwebtoken")



exports.loginStaff = (req,res,next) =>{
    const email = req.body["email"];
    const password = req.body["password"];
    Staff.findOne({email:email}).then(user=>{
        if(!user){
            return res.status(400).send({message:"user doesn't exist!"})
        }
        if(user.email===email && user.password===password){
            const token = jwt.sign({email:user.email,_id:user._id},
                "secret",{
                    expiresIn:"1h"
                }
            )
            return res.status(200).json({"message":"User Loged in!",token:token,userId:user._id.toString()})
        }
    })
}