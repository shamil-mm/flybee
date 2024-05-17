const user_data=require('../../models/user_model')
const otp_email_generator=require('../../functions/otp_email_generator')
   const reset_password=async(req,res)=>{
    try {
        const repas_email=req.body.resetpassword_email
        let check= await user_data.userRegister.findOne({User_email:repas_email})
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
module.exports=reset_password