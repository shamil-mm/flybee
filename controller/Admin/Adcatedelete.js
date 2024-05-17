const add_category=require('../../models/admin_cate_schema')
const Adcatedelete=async(req,res)=>{
    try {
        const delete_id=req.query.id
    
        await add_category.category_schema_model.updateOne({_id:delete_id},{$set:{is_delete:true}})

    } catch (error) {
        console.log(error)
    }
}
module.exports=Adcatedelete