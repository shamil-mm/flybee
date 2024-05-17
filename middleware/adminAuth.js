const is_login=async(req,res,next)=>{
    try {
       
        if(!req.session.admin_id){
            res.redirect('/admin/')
        }else{
            next()
        }
    } catch (error) {
        console.log(error)
    }
}
const is_logout=async(req,res,next)=>{
    try {
       
        if(req.session.admin_id){
            res.redirect('/admin/home')
        }else{
            next()
        }
    } catch (error) {
        console.log(error)
    }
}
module.exports={is_login,is_logout}