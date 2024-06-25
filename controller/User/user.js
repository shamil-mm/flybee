const productSchema=require('../../models/productSchema')
const userSchema=require('../../models/userSchema')
const bcrypt=require('bcrypt')
const otp_email_generator=require('../../functions/otp_email_generator')
const otps=require('../../models/otpSchema')
const wallet=require('../../models/walletSchema')





const homePageRender=async(req,res)=>{
    try {
        const first_8_product=await productSchema.add_pro_model.find({}).limit(8)
        res.render('homePage',{newpro:first_8_product,msg:req.flash('msg'),login:req.flash('login'),user:req.session.user_id,rg:req.flash('rg'),alreadyexist:req.flash('alreadyexist')})
  
    } catch (error) {
        console.log(error);
    }
}


const loadSignin=async(req,res)=>{
    try {
        const{user_email,user_password}=req.body
            const checkEmail=await userSchema.userRegister.findOne({User_email:user_email})
            if(checkEmail){
                    const checkPassword=await bcrypt.compare(user_password, checkEmail.User_password)
                    if(checkPassword){
                         if(checkEmail.Is_block==false){
                            req.session.user_id=checkEmail._id
                            req.flash('login',"login succesful")
                            res.redirect('/homePage')
                        }else{
                            res.redirect('/homePage')
                            req.flash('msg',"user is blocked")
                        }
                    }else{
                        
                        req.flash('msg',"wrong password")
                        res.redirect('/homePage')

                    }
            }
            else{
                req.flash('msg',"user not fount")
                res.redirect('/homePage')
            }
         }
    catch(error){
        console.log(error)
    }
}


const loadRegister=async(req,res)=>{
    try { 
        let name=req.body.register_username;
        let email=req.body.register_email;
        let password=req.body.register_password;
        let number=req.body.register_number;
        let confirmpassword=req.body.confirm_Password;
        let alreadyexist=await userSchema.userRegister.findOne({User_email:email})
        
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
const otpPageRender=async(req,res)=>{
    try {
        res.render('userOtp',{otp:req.flash('otp'),otpstatus:req.flash('otpstatus')})
    } catch (error){
        console.log(error)
    }
}




const loadOTP=async(req,res)=>{
    try {
        const a={input1,input2,input3,input4}=req.body
        let inputOTP=Object.values(a).join('')
        if(req.session.theUser){
        const otp=await otps.findOne({email:req.session.theUser.User_email}) 
       if(otp){
        if(otp.otp == inputOTP){
            req.flash('rg','registration successfull.       Now you can LogIn')
            //  console.log(req.session.theUser)
            const data=new userSchema.userRegister(req.session.theUser)
            data.save()
            const UserWallet=new wallet({
                userId:data._id
            })
           await UserWallet.save()

            
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



const loadResentOtp=async(req,res)=>{
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


   const resetPassword=async(req,res)=>{
    try {
        const repas_email=req.body.resetpassword_email
        let check= await userSchema.userRegister.findOne({User_email:repas_email})
        if(check){
        otp_email_generator((otp_data)=>{
            otp_data.save()
        },repas_email)  
        res.render('userOtp',{re:"repassword"})
        }else{
            res.redirect('/user')
        }
    } catch (error) {
       console.log(error) 
    }
}

const loadOtpRepassword=async(req,res)=>{
    try {
        const a={input1,input2,input3,input4}=req.body
        let inputOTP=Object.values(a).join('')
        const checkOTP=await userSchema.OTP.findOne({User_otp:inputOTP})
        if(checkOTP){
            res.render('changepass')
        }else{
            console.log("invalid otp")
        }
        
    } catch (error) {
   
    }
}


const loadRepassword=async(req,res)=>{
    try {
    const {f_password,s_password,f_email} =req.body
    if(f_password==s_password){
        await userSchema.userRegister.updateOne({User_email:f_email},{$set:{User_password:await bcrypt.hash(f_password,10)}})
    res.redirect('/user')
    }else{
        res.render('/user')
    }    
    } catch (error) {
        console.log(error)
    }
}




module.exports={homePageRender,loadSignin,loadRegister,otpPageRender,loadOTP,loadResentOtp,resetPassword,loadOtpRepassword,loadRepassword}

