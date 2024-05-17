const user_data=require('../../models/user_model')
const bcrypt=require('bcrypt')
const userPassword=async(req,res)=>{
    try {
        let user=req.session.user_id
        if(user){
            const {password,re_password}=req.body
      if(password==re_password){
       const b_pass=await bcrypt.hash(password,10)
        console.log(b_pass)
        const data=await user_data.userRegister.findByIdAndUpdate({_id:user},{$set:{User_password:b_pass}})
        req.flash("pass","password changed")
        res.redirect('/personalInfo')

      }

        }else{
            res.redirect('/homePage')
        }
      
    } catch (error) {
        console.log(error)
    }
}
module.exports=userPassword