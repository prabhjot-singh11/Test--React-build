const ErrorHandler = require('../utils/errorHandler');
const dotenv = require('dotenv')
dotenv.config({path:"backend/config.env"})

module.exports=  (err,req,res,next)=>{
    statuscode = err.statuscode  || 500;
    err.message = err.message ||"Internal Server error"
    if(process.env.NODE_ENV ==="DEVELOPMENT"){
        res.status(statuscode).json({
            success:false,
            error:err,
            errMessage:err.message,
            stack:err.stack
        })
    }
    if(process.env.NODE_ENV== "PRODUCTION"){
        let error = {...err}
        error.message= err.message

        //wrong mongoes ID error
        if(err.name==='CastError'){
            const message = `Resourse not found .Invalid : ${err.path}`
            error = new ErrorHandler(message,400)
        }

        // Handing monngosse validation erro

        if(err.name === 'validationError'){
            const message = Object.values(err.errors).map(values=> values.message)
            error = new  ErrorHandler(message,400)
        }


        // HAnding mongose duplicate key erorro


        if(err.code == "11000"){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            error = new  ErrorHandler(message,400)
        }
        // wrong jwt error 

       if(err.code == 'JsonWebTokenError'){
            const message = 'Json web token is invalid'
            error = new  ErrorHandler(message,400)
        }

        // Handling Expired jwt token

        if(err.code == 'TokenExpiredError'){
            const message = 'Json web token is expired'
            error = new  ErrorHandler(message,400)
        }
    
    res.status(statuscode).json({
        success : false,
        message:err.message || "Internal server error"

    })
   }
}