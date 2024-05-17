const otp=async(req,res)=>{
    try {
        res.render('userOtp',{otp:req.flash('otp'),otpstatus:req.flash('otpstatus')})
    } catch (error){
        console.log(error)
    }
}
module.exports=otp