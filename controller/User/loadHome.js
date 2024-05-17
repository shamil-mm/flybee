const product_data=require('../../models/admin_pro_schema')
const loadHome=async(req,res)=>{
    try {
        const first_8_product=await product_data.add_pro_model.find({}).limit(8)
        res.render('homePage',{newpro:first_8_product,msg:req.flash('msg'),login:req.flash('login'),user:req.session.user_id,rg:req.flash('rg'),alreadyexist:req.flash('alreadyexist')})
  
    } catch (error) {
        console.log(error);
    }
}
module.exports=loadHome

