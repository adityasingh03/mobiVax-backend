const express =require("express")
const userController = require("../controllers/user")
const isAuth = require("../middleware/is-auth")
const route = express.Router()

route.post('/verify',userController.verifyUser)
route.post('/register',userController.registerUser)

module.exports = route

