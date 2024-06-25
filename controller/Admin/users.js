const userSchema=require('../../models/userSchema')
const paginate=require('../../functions/pagination')
const { default: mongoose } = require('mongoose')
const bcrypt=require('bcrypt')
const otps=require('../../models/otpSchema')
const otp_email_generator=require('../../functions/otp_email_generator')


const usersPageRender=async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit =5;
        const Query = {is_admin:false}
        const finalData=await paginate(userSchema.userRegister,page,limit,Query)

       
        res.render('adminUsers', {message:finalData.results,totalPages:finalData.totalPages,currentPage:finalData.currentPage})
        
    } catch (error) {
        console.log(error);
    }
}


const userBlockUnblock=async(req,res)=>{
    try { 
      const d=await userSchema.userRegister.findOne({_id:req.query.userid})
        if(d.Is_block==false){
                await userSchema.userRegister.findByIdAndUpdate(req.query.userid,{Is_block:true},{new:true})
        }else if(d.Is_block==true){
            await userSchema.userRegister.findByIdAndUpdate(req.query.userid,{Is_block:false},{new:true})
        }
        res.redirect('/admin/users')
     
    }catch (error) {
        console.log(error);
    }
        
    } 

module.exports={userBlockUnblock,usersPageRender}
