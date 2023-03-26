const app = require("./app")

const dotenv = require('dotenv')
const cloudinary = require("cloudinary")
const fileUpload = require("express-fileupload")



// handle uncounght 

process.on('uncaughtException', err=>{
    console.log(`ERORR : ${err.message}`);
    console.log(`shutting down server due to uncaught excption`)
    process.exit(1)
})


const connectDatabse = require('./databse')



if (process.env.NODE_ENV !== 'PRODUCTION') require ('dotenv').config({path:'backend/config.env'})

connectDatabse();



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET

})

const server =    app.listen(process.env.PORT,()=>{
    console.log(`sever is running on ${process.env.PORT} `)
})


// handle unhandle promise rejection

process.on('unhandledRejection',err=>{
    console.log(`error : ${err.message}`)
    console.log("shutting down the server due to unhandle ")
    server.close(()=>{
        process.exit(1)
    })
})