const {Category}=require('../../models/categorySchema')


const categoryRenderPage=async(req,res)=>{
    try {
        const all_category=await Category.find({is_delete:false})
        res.render('adminCategories',{categories:all_category,query:req.query})
    } catch (error) {
        console.log( error)
    }
}


const categoryListUnlistLoader=async(req,res)=>{
    try {
        
    const data=await Category.findByIdAndUpdate({_id:req.query.cate_id})
    if(data.is_list==true){
        await Category.updateOne({_id:req.query.cate_id},{$set:{is_list:false}})
    }else{
        await Category.updateOne({_id:req.query.cate_id},{$set:{is_list:true}})
    }

        
    } catch (error) {
        console.log(error)
    }
}


const loadAddCategory=async(req,res)=>{
    try {
       const{category_name,category_description,category_status}=req.body
       
       const save_Date=new Category({
        name:category_name,
        description:category_description,
        status:category_status
       })
       const repeat=await Category.findOne({name:category_name})
       
       if(repeat){
        console.log("category already exist")
        return res.redirect('/admin/categories?error=Category already exists')
       }else{
       await save_Date.save()
       res.redirect('/admin/categories?success=Category added successfully')
       }
    } catch (error) {
        console.log(error)
    }
}



const loadCategoryRecover =async(req,res)=>{
    try {
       await Category.updateOne({_id:req.query.id},{$set:{is_delete:false}})
       res.redirect('/admin/Categories')
    } catch (error) {
        console.log(error);
    }
}



const editCategoryPageRender=async(req,res)=>{
    try {
    const data= req.query.id     
    for_update=await Category.findOne({_id:data})
    res.render("editcategory",{data:for_update})       
    } catch (error) {
        console.log(error);
    }
}

const editCategoryLoader=async(req,res)=>{
    try {
        const id=req.query.id
       const{edit_name,edit_description}= req.body
       const checkDuplicate=await Category.findOne({name:edit_name,_id:{$ne:id}})
      
       if(checkDuplicate){
       return res.redirect('/admin/categories?error=Catetory name already exists')
       }
       await Category.updateOne({_id:id},{$set:{name:edit_name,description:edit_description}})
       res.redirect('/admin/categories')
    } catch (error) {
        console.log(error);
    }
}

const categoryDelete=async(req,res)=>{
    try {
        const delete_id=req.query.id
        await Category.updateOne({_id:delete_id},{$set:{is_delete:true}})

    } catch (error) {
        console.log(error)
    }
}


    const categoryRecoveryPageRender=async(req,res)=>{
        try {
            const delete_category=await Category.find({is_delete:true})
            res.render('d_categories',{d_categories:delete_category})
            
        } catch (error) {
            console.log(error)
        }
    }

    const categoryDeletePermanently=async(req,res)=>{
        try {
            
            await Category.deleteOne({_id:req.query.id})
            res.redirect('/admin/delete/page')
        } catch (error) {
            console.log(error)
        }
    }
    
 




module.exports={categoryRenderPage,loadAddCategory,loadCategoryRecover,categoryListUnlistLoader,editCategoryPageRender,editCategoryLoader,categoryDelete,categoryRecoveryPageRender,categoryDeletePermanently}