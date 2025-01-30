const categorySchema=require('../../models/categorySchema')


const categoryRenderPage=async(req,res)=>{
    try {
        const all_category=await categorySchema.category_schema_model.find({is_delete:false})
        res.render('adminCategories',{categories:all_category})
    } catch (error) {
        console.log( error)
    }
}


const categoryListUnlistLoader=async(req,res)=>{
    try {
        
    const data=await categorySchema.category_schema_model.findByIdAndUpdate({_id:req.query.cate_id})
    if(data.is_list==true){
        await categorySchema.category_schema_model.updateOne({_id:req.query.cate_id},{$set:{is_list:false}})
    }else{
        await categorySchema.category_schema_model.updateOne({_id:req.query.cate_id},{$set:{is_list:true}})
    }

        
    } catch (error) {
        console.log(error)
    }
}


const loadAddCategory=async(req,res)=>{
    try {
       const{category_name,category_description,category_status}=req.body
       
       const save_Date=new categorySchema.category_schema_model({
        name:category_name,
        description:category_description,
        status:category_status
       })
       const repeat=await categorySchema.category_schema_model.findOne({name:category_name})
       
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



const loadCategoryRecover =async(req,res)=>{
    try {
       await categorySchema.category_schema_model.updateOne({_id:req.query.id},{$set:{is_delete:false}})
       res.redirect('/admin/Categories')
    } catch (error) {
        console.log(error);
    }
}



const editCategoryPageRender=async(req,res)=>{
    try {
    const data= req.query.id     
    for_update=await categorySchema.category_schema_model.findOne({_id:data})
    res.render("editcategory",{data:for_update})       
    } catch (error) {
        console.log(error);
    }
}

const editCategoryLoader=async(req,res)=>{
    try {
        const id=req.query.id
       const{edit_name,edit_description}= req.body
       await categorySchema.category_schema_model.updateOne({_id:id},{$set:{name:edit_name,description:edit_description}})
       res.redirect('/admin/categories')
    } catch (error) {
        console.log(error);
    }
}

const categoryDelete=async(req,res)=>{
    try {
        const delete_id=req.query.id
    
        await categorySchema.category_schema_model.updateOne({_id:delete_id},{$set:{is_delete:true}})

    } catch (error) {
        console.log(error)
    }
}


    const categoryRecoveryPageRender=async(req,res)=>{
        try {
            const delete_category=await categorySchema.category_schema_model.find({is_delete:true})
            res.render('d_categories',{d_categories:delete_category})
            
        } catch (error) {
            console.log(error)
        }
    }

    const categoryDeletePermanently=async(req,res)=>{
        try {
            
            await categorySchema.category_schema_model.deleteOne({_id:req.query.id})
            res.redirect('/admin/delete/page')
        } catch (error) {
            console.log(error)
        }
    }
    
 




module.exports={categoryRenderPage,loadAddCategory,loadCategoryRecover,categoryListUnlistLoader,editCategoryPageRender,editCategoryLoader,categoryDelete,categoryRecoveryPageRender,categoryDeletePermanently}