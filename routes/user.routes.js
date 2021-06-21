const express =require("express")
const userController = require("../controllers/user.controller")

const route = express.Router()

route.post('/verify',userController.verifyUser)
route.post('/login',userController.loginUser)

module.exports = route

