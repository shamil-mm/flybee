const user_data=require('../../models/user_model')
const repassword=async(req,res)=>{
    try {
        const a={input1,input2,input3,input4}=req.body
        let inputOTP=Object.values(a).join('')
        const checkOTP=await user_data.OTP.findOne({User_otp:inputOTP})
        if(checkOTP){
            res.render('changepass')
        }else{
            console.log("invalid otp")
        }
        
    } catch (error) {
       console.log("rest") 
    }
}
module.exports=repassword