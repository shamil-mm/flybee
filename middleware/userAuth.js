
const is_login=async(req,res,next)=>{
    try {
        if(!req.session.user_id){
            // console.log(req.session.user_id+"hai")
            res.redirect('/user')
        }else{
            next()
        }
        
    } catch (error) {
        console.log(error)
    }
}
const is_logout=async(req,res,next)=>{
    try {
        // console.log(req.session.user_id+"hello")
        if(req.session.user_id){
            res.redirect('/homePage')
        }else{
            next()
        }
    } catch (error) {
        console.log(error)
    }
}
module.exports={is_login,is_logout}