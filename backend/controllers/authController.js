const User = require('../models/user')

const  ErrorHandler = require('../utils/errorHandler')

const catchAsyncError = require('../middlewares/catchAsyncErrors')

const sendToken = require('../utils/jwtToken')

const sendEmail = require('../utils/sendEmail')
const cloudinary = require("cloudinary")

const crypto  = require('crypto');
const { restart } = require('nodemon');
const { error, log } = require('console')

// Register a use  === /api/v1/register


exports.registerUser = catchAsyncError (async (req,res,next)=>{

        
   
    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: "scale"
    })

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    })

    sendToken(user, 200, res)

})




//login user
exports.loginUser = catchAsyncError(async(req,res,next)=>{
    const {email,password}= req.body;



    if(!email||!password){
        return next(new ErrorHandler('please enter email or password',400))
    }

    //finding user in data base

    const user = await User.findOne({email}).select('+password')
    if(!user){
        return next(new ErrorHandler('invalis email or password',401))

    }

    //check password

    const isPasswordMatch = await user.comparePassword(password)
   if(!isPasswordMatch){
    return next(new ErrorHandler('invalis email or password',401))
   }

   const token = user.getJwtToken();

   sendToken(user,200,res)



})



// forget password 
// api/v1/password/fogot

exports.forgetPassword= catchAsyncError(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return next( new ErrorHandler("user not found ",401))
    }

    const resetToken = user.getResetPassword()

    await user.save({validateBeforeSave:false})

    // create reset email

  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`
   const message = `your password reset token is follow:\n\n${resetUrl}\n\n if you have set it forget it` 
   console.log(message);
 
   try {


  await sendEmail({
    email:user.email,
    subject:'E-shoping password reset',
    message
  })

  console.log(req.protocol);

  res.status(200).json({
    success:true,
    message:`Email sent to user ${user.email}`
  })

    
   } catch (error) {
    user.resetPasswordToken  = undefined
    user.resetPasswordExpire = undefined
    

    await user.save({validateBeforeSave:false});
   
    return next( new ErrorHandler(error.message,500))
   
   }
})



/// reswt password


exports.resetPassword = catchAsyncError(async(req,res,next)=>{
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
     


    const user = await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()}})
    if(!user){
        return next (new ErrorHandler('Password reset token expire ',400))


    }

    if(req.body.password!== req.body.conformPassword){
        return next(new ErrorHandler("Password not matched",400))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save(user);

    sendToken(user,200, res)
}
)



// get login user information

exports.getUserProfile = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success:true,
        user
    })
})


// update / change password 
//api/v1/password/update

exports.updatePassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password');

    const isMatched = await user.comparePassword(req.body.oldPassword)
    if(!isMatched){
        return next(new ErrorHandler("oled password is not same",401))
    }

    user.password = req.body.password;

    await user.save();
    sendToken(user,200,res)
})


//update user profile'

//api/v1/me/update


exports.updateProfile=  catchAsyncError(async(req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email
        }
     
        //update user :TODO
        if (req.body.avatar !== '') {
            const user = await User.findById(req.user.id)
    
            const image_id = user.avatar.public_id;
            const res = await cloudinary.v2.uploader.destroy(image_id);
    
            const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: 'avatars',
                width: 150,
                crop: "scale"
            })
    
            newUserData.avatar = {
                public_id: result.public_id,
                url: result.secure_url
            }
        }
    


        const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
            new:true,
            runValidators:true,
            useFindAndModify:false
            
        })

        res.status(200).json({
            success:true
        })
})



//logout user 


 // api/v1/logout


 exports.logout = catchAsyncError(async(req,res,next)=>{
     res.cookie('token',null,{
        exports:new Date(Date.now()),
        httpOnly:true
     })

     res.status(200).json({
        success:true,
        message:"loged out"
     })
 })





 //// Afdmon routes

 // get all users

 //api/v1/admon/users

 exports.allUsers = catchAsyncError(async(req,res,next)=>{
    const users = await User.find();
    const count  = await User.countDocuments()
    

    res.status(200).json({
        success:true,
        count,
        users
    })
 })

 // Get user detalis
 // api/v1/admin/user/:id


 exports.getUserDetails = catchAsyncError(async(req,res,next)=>{
   const user =  await User.findById(req.params.id);
   if(!user){
    return next (new ErrorHandler(`user does not found with this is ${req.params.id}`));

   }
   
   res.status(200).json({
    success:true,
    user
   })
 })



 //update user profile 



 // api/v1/admin/user/:id


 
exports.updateUser=  catchAsyncError(async(req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
        }

        //update user :TODO
        const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
            new:true,
            runValidators:true,
            useFindAndModify:false
            
        })
        res.status(200).json({
            success:true
        })
})


// Delete user 
// api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async(req,res,next)=>{
    const user =  await User.findById(req.params.id);
    if(!user){
     return next (new ErrorHandler(`user does not found with this is ${req.params.id}`));
 
    }
//remove  avator

    await user.remove();
    
    res.status(200).json({
     success:true,
     user
    })
  })