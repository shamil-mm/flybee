const about=async(req,res,next)=>{
 try {
    res.render('about')
    
 } catch (error) {
    next(error)
 }
}
module.exports=about