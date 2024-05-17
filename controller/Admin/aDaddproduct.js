const add_category=require('../../models/admin_cate_schema')
const aDaddproduct=async(req,res)=>{
    try { 
        const x= await add_category.category_schema_model.find({is_delete:false,is_list:false})
        res.render('adminAddproduct',{category:x})
       
        
    } catch (error) {
        console.log(error)
    }
}
module.exports=aDaddproduct