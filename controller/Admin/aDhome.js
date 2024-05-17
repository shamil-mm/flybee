const aDhome=async(req,res)=>{
    try {
        res.render('index',{rg:req.flash('rg')})
    } catch (error) {
        console.log(error)
    }
}
module.exports=aDhome