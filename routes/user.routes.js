const express =require("express")
const userController = require("../controllers/user.controller")

const route = express.Router()

route.post('/verify',userController.verifyUser)
route.post('/login',userController.loginUser)
route.post('/add-patient',userController.addPatient)
route.get('/get-patients',userController.getPatients)

module.exports = route

