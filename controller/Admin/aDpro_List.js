const add_pro=require('../../models/admin_pro_schema')
const aDpro_List=async(req,res)=>{
    try {
        
       const checkData= await add_pro.add_pro_model.findOne({_id:req.query.id})
       if(checkData.is_list==false){

           const data= await add_pro.add_pro_model.updateOne({_id:req.query.id},{$set:{is_list:true}})
        }else if(checkData.is_list==true){
            const data= await add_pro.add_pro_model.updateOne({_id:req.query.id},{$set:{is_list:false}})
        }
       
    } catch (error) {
        console.log(error);
    }
}
module.exports=aDpro_List