const user_data=require('../../models/user_model')
const edituser=async(req,res)=>{
    try {
        let user=req.session.user_id
        if(user){
            const {name,email,phone}=req.body
           const findData= await user_data.userRegister.find({})
          const filterData= findData.filter((value)=>{
            return value.User_name==name ||value.User_email==email
           })
           if(filterData.length==0){
               const data=await user_data.userRegister.findByIdAndUpdate({_id:user},{$set:{User_name:name,User_email:email,User_number:phone}})
               res.redirect('/personalInfo')
           }else{
            req.flash('form','This user name already existed use another one!!!')
            res.redirect('/personalInfo')
           }
            
        }else{
            res.redirect('/homePage')
        }
        
    } catch (error) {
        console.log(error)
    }
}
module.exports=edituser