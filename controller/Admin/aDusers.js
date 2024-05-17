const user_data=require('../../models/user_model')
const aDusers=async(req,res)=>{
    try {
        const users_data=await user_data.userRegister.find({is_admin:false})
        res.render('adminUsers', {message:users_data})
        
    } catch (error) {
        console.log(error);
    }
}
module.exports=aDusers