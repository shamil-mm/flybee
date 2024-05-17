const otps=require('../../models/otpSchema')
const otp_email_generator=require('../../functions/otp_email_generator')

const loadResentotp=async(req,res)=>{
    try {
      await otps.deleteMany({email:req.session.theUser.User_email})
        if( req.session.theUser){
            let otp =  otp_email_generator(req.session.theUser.User_email)
            console.log("resent otp :"+otp)
            const newOTP=new otps({email:req.session.theUser.User_email,otp})
         const OTP=  await newOTP.save();
         req.flash('otp',OTP)
           res.redirect('/otp') 
             } 
              else{
               res.redirect('/homePage')
           } 
        
    } catch (error) {
        console.log(error)
    }
}
module.exports=loadResentotp