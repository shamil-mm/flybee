const product_data=require('../../models/admin_pro_schema')
const render_women=async(req,res)=>{
    try {
        const data=await product_data.add_pro_model.find({}).populate('category')
        const womensproduct=data.filter((product)=>{
            return product.category.name=="Women's"
        })
       
        res.render('womens',{women:womensproduct})
    } catch (error) {
        console.log(error);
    }
}
module.exports=render_women