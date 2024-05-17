const add_category=require('../../models/admin_cate_schema')
const add_pro=require('../../models/admin_pro_schema')
const aDeditproduct=async(req,res)=>{
    try {
        const Data=await add_pro.add_pro_model.findOne({_id:req.query.id}).populate('category')
        const category=await add_category.category_schema_model.find({is_delete:false,is_list:false})
        
        res.render("adminEditproduct",{data:Data,category,msg:req.flash('msg')})
    } catch (error) {
       console.log('error') 
    }
}
module.exports=aDeditproduct