const express = require('express')


const app = express();

const PORT = 5000;

app.listen(()=>{
    console.log(`Server started at port ${PORT}`)
})