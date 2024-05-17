const user_data=require('../../models/user_model')

const aDblock=async(req,res)=>{
    try {
        // console.log(req.query.userid);
      const d=await user_data.userRegister.findOne({_id:req.query.userid})
        if(d.Is_block==false){
                await user_data.userRegister.findByIdAndUpdate(req.query.userid,{Is_block:true},{new:true})
               
        }else if(d.Is_block==true){
            await user_data.userRegister.findByIdAndUpdate(req.query.userid,{Is_block:false},{new:true})
      
        }
        res.redirect('/admin/users')
     
    }catch (error) {
        console.log(error);
    }
        
    } 
module.exports=aDblock
