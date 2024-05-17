const user_data=require('../../models/user_model')
const loadRepassword=async(req,res)=>{
    try {
    const {f_password,s_password,f_email} =req.body
    if(f_password==s_password){
        await user_data.userRegister.updateOne({User_email:f_email},{$set:{User_password:await bcrypt.hash(f_password,10)}})
    res.redirect('/user')
    }else{
        res.render('/user')
    }    
    } catch (error) {
        console.log(error)
    }
}
module.exports=loadRepassword