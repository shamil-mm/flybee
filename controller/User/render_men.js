const product_data=require('../../models/admin_pro_schema')
const render_men=async(req,res)=>{
    try {
      const data= await product_data.add_pro_model.find({}).populate("category")
    const menProducts=data.filter((product)=>{
        return product.category.name=="Men's"
    })
    
       res.render('mens',{men:menProducts}) 
    } catch (error) {
        console.log(error);
    }
}
module.exports=render_men