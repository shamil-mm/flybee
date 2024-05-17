const user_data=require('../../models/user_model')
const bcrypt=require('bcrypt')
const otp_email_generator=require('../../functions/otp_email_generator')
const otps=require('../../models/otpSchema')
const loadRG=async(req,res)=>{
    try { 
        let name=req.body.register_username;
        let email=req.body.register_email;
        let password=req.body.register_password;
        let number=req.body.register_number;
        let confirmpassword=req.body.confirm_Password;
        let alreadyexist=await user_data.userRegister.findOne({User_email:email})
        
     if(alreadyexist){
                        // console.log("already user existed")
                        req.flash('alreadyexist','User already existed... Try again')
                        res.redirect('/homePage')
                        return
                        
                    }else{
                    let hash_password = await bcrypt.hash(password,10)
                    let userData={
                        User_name:name,
                        User_email:email,
                        User_number:number,
                        User_password:hash_password
                      }
                      req.session.theUser=userData;
                      if( req.session.theUser){
                     let otp =  otp_email_generator(email)
                    console.log(otp);
                     const newOTP=new otps({email,otp})
                  const OTP=  await newOTP.save();
                  req.flash('otp',OTP)
                
                    res.redirect('/otp') 
                      }
                       else{
                        req.redirect('/user')
                    }  
     } 
    }
     catch (error) {
        console.log(error)
    }
}
module.exports=loadRG