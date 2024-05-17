const add_pro=require('../../models/admin_pro_schema')
const aDdelete_pro=async(req,res)=>{
    try {
        await add_pro.add_pro_model.updateOne({_id:req.query.id},{$set:{is_delete:true}}) 
    } catch (error) {
        console.log(error)
    }
}
module.exports=aDdelete_pro