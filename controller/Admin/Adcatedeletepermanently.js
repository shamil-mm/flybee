const Adcatedeletepermanently=async(req,res)=>{
    try {
        
        await add_category.category_schema_model.deleteOne({_id:req.query.id})
        res.redirect('/admin/delete/page')
    } catch (error) {
        console.log(error)
    }
}
module.exports=Adcatedeletepermanently