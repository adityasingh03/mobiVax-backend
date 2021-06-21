const User = require("../models/user.model");
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")

dotenv.config();
const client = require("twilio")(process.env.accountSID,process.env.authToken);



exports.loginUser = (req,res,next) => {
    var mobileNo = req.body.mobileNo;
    mobileNo = "+91" + mobileNo;
    User.findOne({mobileNo:mobileNo}).then(user=>{
        if(!user){
            const user = new User({
                mobileNo:mobileNo
            })
            user.save().then(result=>{
                console.log(result)
                client.verify.services(process.env.serviceId).verifications.create({
                    to:mobileNo,
                    channel:"sms"
                }).then(data=>{
                    return res.status(302).json({message:"OTP is send to your phone","redirect":true,"path":"/verify"})
                }).catch(err=>{
                    console.log(err)
                    return res.status(400).send({message:"Error in sending OTP"})
                })
            }).catch(err=>{
                return res.status(400).send({message:"Error in saving user"})
            })
        }else{
            client.verify.services(process.env.serviceId).verifications.create({
                to:mobileNo,
                channel:"sms"
            }).then(data=>{
               return res.status(302).json({message:"OTP is send to your phone","redirect":true,"path":"/verify"})
            }).catch(err=>{
                console.log(err)
                return res.status(400).send({message:"Error in sending OTP"})
            })
        }
    })
}


exports.verifyUser = (req,res,next) =>{
    const mobileNo = "+91"+req.body.mobileNo;
    const otp = req.body.otp;
    User.findOne({mobileNo:mobileNo}).then(user=>{
        if(!user){
            return res.status(302).json({"message":"User not registered","redirect":true,"path":"/register"})
        }
        client.verify.services(process.env.serviceId).verificationChecks.create({
            to:mobileNo,
            code:otp
        }).then(data=>{
            if(data.status==="approved"){
                const token = jwt.sign({email:user.email,_id:user._id},
                    "secret",{
                        expiresIn:"1h"
                    }
                )
                res.status(200).json({"message":"User Loged in!",token:token,userId:user._id.toString()})
            }else{
                res.status(401).json({"message":"login failed, wrong otp!"})
            }
        })
    })
}

