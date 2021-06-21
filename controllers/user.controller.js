const User = require("../models/user");
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
const code = require("country-state-picker")

dotenv.config();
const client = require("twilio")(process.env.accountSID,process.env.authToken);

exports.registerUser = (req,res,next) =>{
    const countryCode = req.body.countryCode;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const mobileNo = req.body.mobileNo;
    const email = req.body.email;
    var mobileNoRe=/([+]?\d{1,2}[.-\s]?)?(\d{3}[.-]?){2}\d{4}/
    if(!code.getCountry(countryCode)){
        return res.status(422).json({message:"Please enter vaild Country code!!"})
    }
    if((!mobileNo.match(mobileNoRe))){
        return res.status(422).json({message:"Please enter vaild Mobile Number"})
    }

    var mailformat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!req.body.email.match(mailformat))
    {
        return res.status(422).json({message:"Please enter vaild email address!"});
    }
   

    User.find({mobileNo:mobileNo}).then(existedUser=>{
        //console.log(existedUser)
        if(existedUser.length>0){
            return res.status(302).json({"message":"User already exists","redirect":true,"path":"/login"})
        }

        const user = new User({
            firstname:firstname,
            lastname:lastname,
            mobileNo:countryCode+mobileNo,
            email:email,
        })
        user.save().then(user=>{
            //console.log(user)
            res.status(200).json({message:"User successfully registered!"})
        }).catch(err=>{
            //console.log(err)
            res.status(409).json({"message":"Try with another email and Mobile no."})
        })
    }).catch(err=>{
        res.status(409).json({"message":"Registration Failed Please Try again."})
    })
}


exports.loginUser = (req,res,next) => {
    var mobileNo = req.body.mobileNo;
    const countryCode = req.body.countryCode;
    mobileNo = countryCode + mobileNo;
    if(!code.getCountry(countryCode)){
        return res.status(422).json({message:"Please enter vaild Country code!!"})
    }
    User.findOne({mobileNo:mobileNo}).then(user=>{
        if(!user){
            return res.status(302).json({"message":"User not registered","redirect":true,"path":"/register"})
        }
        client.verify.services(process.env.serviceId).verifications.create({
            to:mobileNo,
            channel:"sms"
        }).then(data=>{
            res.status(302).json({message:"OTP is send to your phone","redirect":true,"path":"/verify"})
        })
    })
}


exports.verifyUser = (req,res,next) =>{
    const mobileNo = req.body.mobileNo;

    const code = req.body.code;
    User.findOne({mobileNo:mobileNo}).then(user=>{
        if(!user){
            return res.status(302).json({"message":"User not registered","redirect":true,"path":"/register"})
        }
        client.verify.services(process.env.serviceId).verificationChecks.create({
            to:mobileNo,
            code:code
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

