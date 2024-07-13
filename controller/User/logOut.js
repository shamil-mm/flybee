const logOut=async(req,res,next)=>{
    try {
       delete req.session.user_id
       res.redirect('/')
    } catch (error) {
        next(error)
    }
}
module.exports=logOut