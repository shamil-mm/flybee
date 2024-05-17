const add_category=require('../../models/admin_cate_schema')
const aDcategory=async(req,res)=>{
    try {
       const{category_name,category_description,category_status}=req.body
       
       const save_Date=new add_category.category_schema_model({
        name:category_name,
        description:category_description,
        status:category_status
       })
       const repeat=await add_category.category_schema_model.findOne({name:category_name})
       
       if(repeat){
        console.log("category already exist")
        res.redirect('/admin/categories')
       }else{
       save_Date.save()
       res.redirect('/admin/categories')
       }
    } catch (error) {
        console.log(error)
    }
}
module.exports=aDcategory