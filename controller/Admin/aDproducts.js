const add_pro=require('../../models/admin_pro_schema')
const aDproducts=async(req,res)=>{
    try {
       
      
        const full_data=await add_pro.add_pro_model.find({is_delete:false})
        res.render('adminProducts',{data:full_data,msg:req.flash("msg"),msg1:req.flash("msg1")})
        
    } catch (error) {
       console.log(error) 
    }
}
module.exports=aDproducts