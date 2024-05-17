const { default: mongoose } = require('mongoose')
const bcrypt=require('bcrypt')
const user_data=require('../../models/user_model')
const otps=require('../../models/otpSchema')
const otp_email_generator=require('../../functions/otp_email_generator')


const loadRGform=async(req,res)=>{
    try {
      const{username,useremail,userpassword}=req.body
      let alreadyexist=await user_data.userRegister.findOne({User_email:useremail})
      if(alreadyexist){
        console.log("already existed");
        res.redirect('/admin/register')
        return
      }else{
        let hash_password = await bcrypt.hash(userpassword,10)
        let userData={
            User_name:username,
            User_email:useremail,
            User_password:hash_password,
            is_admin:true
          }
        req.session.theuser=userData
        if(req.session.theuser){
            let otp=otp_email_generator(useremail)
            console.log(otp);
            const newOTP=new otps({email:useremail,otp})
                  const OTP=  await newOTP.save();
                  req.flash('otp',OTP)
               
        }
        res.redirect('/admin/otp')
      }
    } catch (error) {
        console.log(error)
    }
}
module.exports=loadRGform