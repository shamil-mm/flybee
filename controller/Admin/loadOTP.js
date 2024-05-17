const otps=require('../../models/otpSchema')
const user_data=require('../../models/user_model')
const loadOTP=async(req,res)=>{
    try {
        const a={input1,input2,input3,input4}=req.body
        let inputOTP=Object.values(a).join('')
        if(req.session.theuser){
        const otp=await otps.findOne({email:req.session.theuser.User_email}) 
       if(otp){
        if(otp.otp == inputOTP){
            req.flash('rg',`registration successfull`)
            const data=new user_data.userRegister(req.session.theUser)
            await data.save()
            console.log('data saved');
            res.redirect('/admin/home')
            
        }else{
            req.flash('otpstatus','Incorrect OTP')
            res.redirect('/admin/otp');
                }}
                else{
                    req.flash('otpstatus','click resend OTP')
                }}else{
                    res.redirect('/admin/register')
                }
    } catch (error) {
        console.log(error);
    }
}
module.exports=loadOTP