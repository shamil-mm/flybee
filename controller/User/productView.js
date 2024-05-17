const product_data=require('../../models/admin_pro_schema')
const productView=async(req,res)=>{
    try {
        const id =req.query.id
       const singleData= await product_data.add_pro_model.findOne({_id:id}).populate('category')
     res.render('productView',{singleData})
    } catch (error) {
        console.log(error);
    }
}
module.exports=productView