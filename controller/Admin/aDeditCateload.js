const add_category=require('../../models/admin_cate_schema')
const aDeditCateload=async(req,res)=>{
    try {
        const id=req.query.id
       const{edit_name,edit_description}= req.body
       await add_category.category_schema_model.updateOne({_id:id},{$set:{name:edit_name,description:edit_description}})
       res.redirect('/admin/categories')
    } catch (error) {
        console.log(error);
    }
}
module.exports=aDeditCateload