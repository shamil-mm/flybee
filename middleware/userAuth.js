const user=require('../models/userSchema')

const is_login=async(req,res,next)=>{
    try {
        if(!req.session.user_id){ 
            res.redirect('/')
        }else{
            const userOkay = await user.userRegister.findOne({_id:req.session.user_id,Is_block:true});
            if(userOkay){
                req.session.user_id=null
                res.redirect('/')

            }else{
                next()
            }

           
        }
        
    } catch (error) {
        console.log(error)
    }
}
const is_logout=async(req,res,next)=>{
    try {
        
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