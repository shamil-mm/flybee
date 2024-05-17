const logOut=async(req,res)=>{
    try {
        
       delete req.session.user_id
       
        res.redirect('/homePage')
    } catch (error) {
        console.log(error)
    }
}
module.exports=logOut