const mongoose=require('mongoose')
const otpSchema=new mongoose.Schema({
    email:{type:String,required:true},
    otp:{type:String,required:true},
    createdAt:{type:Date,default:Date.now}
})
otpSchema.index({expireAfterSeconds:80})
const Otp=mongoose.model('otp',otpSchema)
module.exports=Otp;