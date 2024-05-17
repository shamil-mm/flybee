const add_category=require('../../models/admin_cate_schema')
const aDlist=async(req,res)=>{
    try {
    //    console.log(req.query.cate_id)
    const data=await add_category.category_schema_model.findByIdAndUpdate({_id:req.query.cate_id})
    // console.log(data)
    if(data.is_list==true){
        await add_category.category_schema_model.updateOne({_id:req.query.cate_id},{$set:{is_list:false}})
    }else{
        await add_category.category_schema_model.updateOne({_id:req.query.cate_id},{$set:{is_list:true}})
    }

        
    } catch (error) {
        console.log(error)
    }
}
module.exports=aDlist