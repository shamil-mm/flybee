const otps=require('../../models/otpSchema')
const userSchema=require('../../models/userSchema')
const otp_email_generator=require('../../functions/otp_email_generator')
const bcrypt=require('bcrypt')

const LoginPage=async(req,res)=>{
    try {
        res.render('adminLogin',{msg:req.flash('msg')})
    } catch (error) {
        console.log(error)
    }
}
const registerPage=async(req,res)=>{
    try {
        res.render('adminRegister')
    } catch (error){
        console.log(error)
    }
}
const loadLoginForm=async(req,res)=>{
    try {
      const{email12,password12}=req.body
   
    const checkEmail=await userSchema.userRegister.findOne({User_email:email12})
    if(checkEmail){
        const checkPassword=await bcrypt.compare(password12,checkEmail.User_password)
        if(checkPassword){
             if(checkEmail.Is_block==false && checkEmail.is_admin==true){
                req.session.admin_id=checkEmail._id
                console.log(req.session.admin_id)
                res.redirect('/admin/home')
            }else{
                req.flash('msg',"user is blocked")
                res.redirect('/admin')
                
            }
        }else{
            
            req.flash('msg',"wrong password")
            res.redirect('/admin')
        }
}
else{
    req.flash('msg',"user not fount")
    res.redirect('/admin')
}
    } catch (error) {
        console.log(error) 
    }
}
const loadRegisterForm=async(req,res)=>{
    try {
      const{username,useremail,userpassword}=req.body
      let alreadyexist=await userSchema.userRegister.findOne({User_email:useremail})
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

const homePage=async(req,res)=>{
    try {
        res.render('index',{rg:req.flash('rg')})
    } catch (error) {
        console.log(error)
    }
}
const otpPageRender=async(req,res)=>{
    try {
        res.render('adminOtp',{otp:req.flash('otp'),otpstatus:req.flash('otpstatus')})
    } catch (error) {
        console.log(error)
    }
}

const loadOTP=async(req,res)=>{
    try {
        const a={input1,input2,input3,input4}=req.body
        let inputOTP=Object.values(a).join('')
        if(req.session.theuser){
        const otp=await otps.findOne({email:req.session.theuser.User_email}) 
       if(otp){
        if(otp.otp == inputOTP){
            req.flash('rg',`registration successfull`)
            const data=new userSchema.userRegister(req.session.theUser)
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



module.exports={LoginPage,registerPage,loadLoginForm,loadRegisterForm,homePage,otpPageRender,loadOTP,resentOTP}