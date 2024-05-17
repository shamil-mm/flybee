const add_category=require('../../models/admin_cate_schema')
const aDeditCate=async(req,res)=>{
    try {
    const data= req.query.id     
    for_update=await add_category.category_schema_model.findOne({_id:data})
    res.render("editcategory",{data:for_update})       
    } catch (error) {
        console.log(error);
    }
}
module.exports=aDeditCate