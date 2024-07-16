const productSchema=require('../../models/productSchema')
const userSchema=require('../../models/userSchema')
const bcrypt=require('bcrypt')
const otp_email_generator=require('../../functions/otp_email_generator')
const otps=require('../../models/otpSchema')
const wallet=require('../../models/walletSchema')
const order=require('../../models/orderSchema')

const homePageRender=async(req,res,next)=>{
    try {
        const product=await productSchema.add_pro_model.find({is_delete:false,is_list:false}).populate('category').sort({updatedAt:1}).limit(8)
        
        const first_8_product= await Promise.all(product.map(async(product)=>{
            let finalPercentage=0
            let productOffer = 0;
            let categoryOffer = 0;
  
            const activeProductOffers = await offerHelper.getActiveProductOffers(product._id)
            const activeCategoryOffers = await offerHelper.getActiveCategoryOffers(product.category._id)
  
              if(activeProductOffers.length>0){
  
                activeProductOffers.forEach((offer)=>{
                  const offerAmount =offer.offerPrecentage;
                  productOffer = Math.max(productOffer, offerAmount);
                })
              }
  
  
              if(activeCategoryOffers.length>0){
                activeCategoryOffers.forEach((offer)=>{
                const offerAmount = offer.offerPrecentage;
                categoryOffer = Math.max(categoryOffer, offerAmount);
             
                })
              }
              finalPercentage=productOffer>categoryOffer?productOffer:categoryOffer
              const updated_data=await productSchema.add_pro_model.findByIdAndUpdate(product._id, {offerPercentage:finalPercentage}, {new: true});
              return {...product.toObject(),finalPercentage}
  
          }))

        res.render('homePage',{newpro:first_8_product,msg:req.flash('msg'),login:req.flash('login'),user:req.session.user_id,rg:req.flash('rg'),alreadyexist:req.flash('alreadyexist')})
    } catch (error) {
        next(error);
    }
}
const loadSignin=async(req,res,next)=>{
    try {
        const{user_email,user_password}=req.body
            const checkEmail=await userSchema.userRegister.findOne({User_email:user_email})
            if(checkEmail){
                    const checkPassword=await bcrypt.compare(user_password, checkEmail.User_password)
                    if(checkPassword){
                         if(checkEmail.Is_block==false){
                            req.session.user_id=checkEmail._id
                            req.flash('login',"login succesful")
                            res.redirect('/')
                        }else{
                            res.redirect('/')
                            req.flash('msg',"user is blocked")
                        }
                    }else{
                        
                        req.flash('msg',"wrong password")
                        res.redirect('/')

                    }
            }
            else{
                req.flash('msg',"user not fount")
                res.redirect('/')
            }
         }
    catch(error){
         next(error)
    }
}


const loadRegister=async(req,res,next)=>{
    try { 
        const {register_username,register_email,register_password,register_number,Refferal}=req.body
        if(Refferal){

            const checkRefferalCode = await userSchema.userRegister.findOne({referalCode:Refferal})
            if(!checkRefferalCode){
                req.flash('alreadyexist','the refferal code is failled')
                res.redirect('/')
                return
            }
        }
        let alreadyexist=await userSchema.userRegister.findOne({User_email:register_email})
        
         if(alreadyexist){
                       
                        req.flash('alreadyexist','User already existed... Try again')
                        res.redirect('/')
                        return
                        
                    }else{
                    let hash_password = await bcrypt.hash(register_password,10)
                    let userData={
                        User_name:register_username,
                        User_email:register_email,
                        User_number:register_number,
                        User_password:hash_password,
                        Refferal
                      }
                      req.session.theUser=userData;
                      if( req.session.theUser){
                     let otp =  otp_email_generator(register_email)
                    console.log(otp);
                     const newOTP=new otps({email:register_email,otp})
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
         next(error)
    }
}
const otpPageRender=async(req,res,next)=>{
    try {
        
        res.render('userOtp',{otp:req.flash('otp'),otpstatus:req.flash('otpstatus')})
    } catch (error){
         next(error)
    }
}




const loadOTP=async(req,res,next)=>{
    try {
        const a={input1,input2,input3,input4}=req.body
        let inputOTP=Object.values(a).join('')
        if(req.session.theUser){
        const otp=await otps.findOne({email:req.session.theUser.User_email}) 
       if(otp){
        
        if(otp.otp == inputOTP){
          
            const{Refferal}=req.session.theUser
           
            if(Refferal){
                const refferalUser = await userSchema.userRegister.findOne({referalCode:Refferal})
                await wallet.findOneAndUpdate({userId:refferalUser._id},{$inc:{userBalance:100},$push:{transferHistory:{type:'CREDIT',amount:100,description:"the refffered offer"}}},{new:true})
            }
            req.flash('rg','registration successfull.       Now you can LogIn')
          
            const{User_email}=req.session.theUser
            req.session.theUser.referalCode=User_email+inputOTP
            const data=new userSchema.userRegister(req.session.theUser)
            data.save()
            const UserWallet=new wallet({
                userId:data._id
            })
           await UserWallet.save()
           res.redirect('/')
            
        }else{
            req.flash('otpstatus','Incorrect OTP')
            res.redirect('/otp');
                }}
                else{
                    req.flash('otpstatus','click resend OTP')
                }}else{
                    
                    const otp=await otps.findOne({email:req.session.forgotpasswordEmail}) 
                    if(otp.otp == inputOTP){
                        res.redirect('/#setforgotpassword-modal')
                    }else{
                        req.flash('otpstatus','Incorrect OTP')
                        res.redirect('/otp');
                      
                    }
   
                }
    } catch (error) {
         next(error)
    }
}



const loadResentOtp=async(req,res,next)=>{
    try {
   
        if( req.session.theUser){
            let otp =  otp_email_generator(req.session.theUser.User_email)
            console.log("resent otp :"+otp)
            await otps.deleteMany({email:req.session.theUser.User_email})
            const newOTP=new otps({email:req.session.theUser.User_email,otp})
         const OTP=  await newOTP.save();
         req.flash('otp',OTP)
           res.redirect('/otp') 
             } 
            else{
                let otp =  otp_email_generator(req.session.forgotpasswordEmail)
                console.log("forgot password resent otp :"+otp)
                await otps.deleteMany({email:req.session.forgotpasswordEmail})
            const newOTP=new otps({email:req.session.forgotpasswordEmail,otp})
         const OTP=  await newOTP.save();
         req.flash('otp',OTP)
         res.redirect('/otp')
           } 
        
    } catch (error) {
         next(error)
    }
}


   const resetPassword=async(req,res,next)=>{
    try {
        const {forgotpasswordEmail}=req.body
        let check= await userSchema.userRegister.findOne({User_email:forgotpasswordEmail})
        if(check){ 
        let otp =  otp_email_generator(forgotpasswordEmail)
        console.log("forgot password otp :"+otp)
       
        await otps.deleteMany({email:check.User_email})      
        const newOTP=new otps({email:check.User_email,otp})
        const OTP=  await newOTP.save();
        req.session.forgotpasswordEmail=check.User_email
        req.flash('otp',OTP)
          res.redirect('/otp')
        }else{
            res.redirect('/#signin-modal')
        }
    } catch (error) {
        next(error) 
    }
}




const loadRepassword=async(req,res,next)=>{
    try {
    const {f_password,s_password} =req.body
    if(f_password==s_password){
        await userSchema.userRegister.updateOne({User_email:req.session.forgotpasswordEmail},{$set:{User_password:await bcrypt.hash(f_password,10)}})
        req.flash('login',"Password reseted")
        res.redirect('/')
    }else{
        res.render('/')
    }    
    } catch (error) {
         next(error)
    }
}
const error=async(req,res,next)=>{
    try {
        res.render('error')
        
    } catch (error) {
         next(error)
    }
}




module.exports={homePageRender,loadSignin,loadRegister,otpPageRender,loadOTP,loadResentOtp,resetPassword,loadRepassword,error}

