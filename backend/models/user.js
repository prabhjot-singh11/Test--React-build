const mongoes  =require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto= require("crypto")

const jwt = require('jsonwebtoken')

const userSchema = new mongoes.Schema({

    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Your name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be longer than 6 characters'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})


userSchema.pre("save", async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)
})

//compare user pasword

userSchema.methods.comparePassword = async function(enterdPassword){
    return await bcrypt.compare(enterdPassword,this.password)
}



// Return json JWt token

userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE_TIME
    })
}



/// genetrate password reset token


userSchema.methods.getResetPassword = function(){
   //generate toke

   const resetToken = crypto.randomBytes(20).toString('hex');
   //
   this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
   //token 

   this.resetPasswordExpire = Date.now()+30*60*1000

   return resetToken

}

module.exports = mongoes.model('User',userSchema);