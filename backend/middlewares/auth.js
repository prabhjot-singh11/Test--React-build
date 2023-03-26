const JWT = require("jsonwebtoken");
const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

exports.isAuthenticateUser = catchAsyncErrors(async(req,res,next)=>{
   

    const {token}=  req.cookies
    
    
    if(token=='j:null'){
      
        return next(new ErrorHandler('please login first ',401))
      
    }
  

    const decode =JWT.verify(token,process.env.JWT_SECRET)
   req.user = await User.findById(decode.id)
   next()
  
})


exports.authorizeRole =(...roles)=>{
   
    return(req,res,next)=>{
        // console.log(req.user.role);
        if(!roles.includes(req.user.role)){
        next(new ErrorHandler(`Role (${req.user.role}) id not allowed  ti use this resourceses`,403))
        }
        next()
    }
}