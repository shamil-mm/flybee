const add_pro=require('../../models/admin_pro_schema')
const aDrecover_p=async(req,res)=>{
    try {
        await add_pro.add_pro_model.updateOne({_id:req.query.id},{$set:{is_delete:false}}) 
    } catch (error) {
        console.log(error);
    }
}
module.exports=aDrecover_p