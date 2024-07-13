const logOut=async(req,res,next)=>{
    try {
       delete req.session.user_id
       res.redirect('/homePage')
    } catch (error) {
        next(error)
    }
}
module.exports=logOut