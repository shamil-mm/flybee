const add_category=require('../../models/admin_cate_schema')
const aDcategories=async(req,res)=>{
    try {
        const all_category=await add_category.category_schema_model.find({is_delete:false})
        res.render('admincategories',{categories:all_category})
    } catch (error) {
        console.log( error)
    }
}
module.exports=aDcategories