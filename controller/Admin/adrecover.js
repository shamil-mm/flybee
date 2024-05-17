const add_category=require('../../models/admin_cate_schema')
    const adrecover=async(req,res)=>{
        try {
            const delete_category=await add_category.category_schema_model.find({is_delete:true})
            res.render('d_categories',{d_categories:delete_category})
            
        } catch (error) {
            console.log(error)
        }
    }
    module.exports=adrecover