const otps=require('../../models/otpSchema')
const otp_email_generator=require('../../functions/otp_email_generator')
const resentOTP=async(req,res)=>{
    try {
        if( req.session.theuser){
            await otps.deleteMany({email:req.session.theuser.User_email})
            let otp =  otp_email_generator(req.session.theuser.User_email)
            console.log("resent otp :"+otp)
            const newOTP=new otps({email:req.session.theuser.User_email,otp})
         const OTP=  await newOTP.save();
         req.flash('otp',OTP)
           res.redirect('/admin/otp') 
             } 
              else{
               res.redirect('/admin/register')
           }  
    } catch (error) {
        console.log(error);
    }
}
module.exports=resentOTP