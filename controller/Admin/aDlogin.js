const aDlogin=async(req,res)=>{
    try {
        res.render('adminLogin',{msg:req.flash('msg')})
    } catch (error) {
        console.log(error)
    }
}
module.exports=aDlogin