const user_data=require('../../models/user_model')
const bcrypt=require('bcrypt')
const loadSI=async(req,res)=>{
    try {
        const{user_email,user_password}=req.body
            const checkEmail=await user_data.userRegister.findOne({User_email:user_email})
            if(checkEmail){
                    const checkPassword=await bcrypt.compare(user_password, checkEmail.User_password)
                    if(checkPassword){
                         if(checkEmail.Is_block==false){
                            req.session.user_id=checkEmail._id
                            req.flash('login',"login succesful")
                            res.redirect('/homePage')
                        }else{
                            res.redirect('/homePage')
                            req.flash('msg',"user is blocked")
                        }
                    }else{
                        
                        req.flash('msg',"wrong password")
                        res.redirect('/homePage')

                    }
            }
            else{
                req.flash('msg',"user not fount")
                res.redirect('/homePage')
            }
         }
    catch(error){
        console.log(error)
    }
}
module.exports=loadSI