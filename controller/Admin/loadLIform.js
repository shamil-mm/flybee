const bcrypt=require('bcrypt')
const user_data=require('../../models/user_model')

const loadLIform=async(req,res)=>{
    try {
      const{email12,password12}=req.body
   
    const checkEmail=await user_data.userRegister.findOne({User_email:email12})
    if(checkEmail){
        const checkPassword=await bcrypt.compare(password12,checkEmail.User_password)
        if(checkPassword){
             if(checkEmail.Is_block==false && checkEmail.is_admin==true){
                req.session.admin_id=checkEmail._id
                console.log(req.session.admin_id)
                res.redirect('/admin/home')
            }else{
                req.flash('msg',"user is blocked")
                res.redirect('/admin')
                
            }
        }else{
            
            req.flash('msg',"wrong password")
            res.redirect('/admin')
        }
}
else{
    req.flash('msg',"user not fount")
    res.redirect('/admin')
}
    } catch (error) {
        console.log(error) 
    }
}
module.exports=loadLIform