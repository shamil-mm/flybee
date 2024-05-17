const add_category=require('../../models/admin_cate_schema')
const aDrecover_cate =async(req,res)=>{
    try {
       await add_category.category_schema_model.updateOne({_id:req.query.id},{$set:{is_delete:false}})
       res.redirect('/admin/Categories')
    } catch (error) {
        console.log(error);
    }
}
module.exports=aDrecover_cate