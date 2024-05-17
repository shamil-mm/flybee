const otps=require('../../models/otpSchema')
const user_data=require('../../models/user_model')
const loadOTP=async(req,res)=>{
    try {
        const a={input1,input2,input3,input4}=req.body
        let inputOTP=Object.values(a).join('')
        if(req.session.theUser){
        const otp=await otps.findOne({email:req.session.theUser.User_email}) 
       if(otp){
        if(otp.otp == inputOTP){
            req.flash('rg','registration successfull.       Now you can LogIn')
             console.log(req.session.theUser)
            const data=new user_data.userRegister(req.session.theUser)
            data.save()
            res.redirect('/homePage')
            
        }else{
            req.flash('otpstatus','Incorrect OTP')
            res.redirect('/otp');
                }}
                else{
                    req.flash('otpstatus','click resend OTP')
                }}else{
                    res.redirect('/homePage')
                }
    } catch (error) {
        console.log(error)
    }
}
module.exports=loadOTP