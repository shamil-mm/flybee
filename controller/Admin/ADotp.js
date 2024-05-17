const ADotp=async(req,res)=>{
    try {
        res.render('adminOtp',{otp:req.flash('otp'),otpstatus:req.flash('otpstatus')})
    } catch (error) {
        console.log(error)
    }
}
module.exports=ADotp