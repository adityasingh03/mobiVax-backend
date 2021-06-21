const express =  require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const userRoute =  require("./routes/user.routes");
const staffRoute = require("./routes/staff.routes")
dotenv.config();
const mongoDbUrl = process.env.MONGODBURL;
const port = process.env.PORT || 3000;
const app = express()

// app.get('/',(req,res,next)=>{
//     res.send("Hello")
// })
app.use(express.json())
app.use(express.urlencoded())

app.use("/user",userRoute)
app.use("/staff",staffRoute)

mongoose.connect(mongoDbUrl).then(result=>{
    app.listen(port,()=>{
        console.log(`App is running on Port ${port} and connected to Database`)
    })
}).catch(err=>{
    console.log(err)
})



