const express =require("express")
const staffController = require("../controllers/staff.controller")

const route = express.Router()

route.post('/login',staffController.loginStaff)

module.exports = route

