const product_data=require('../../models/admin_pro_schema')
const category=require('../../models/admin_cate_schema')
const render_Product=async(req,res)=>{
    try {
        const limit=8;
        const page=Number(req.query.page)||1
        const skip=(page-1)*limit
        const count= await product_data.add_pro_model.find({is_delete:false,is_list:false}).populate('category').countDocuments()
        const pages=Math.ceil(count/limit)


      const product= await product_data.add_pro_model.find({is_delete:false,is_list:false}).populate('category').limit(limit*1).skip((page-1)*limit)
     
      if(req.session.sort !== undefined ){
        res.render('product',{product:req.session.sort,msg:req.flash('msg'),pages,currentPage:page,cate_list:[]})
      }else{
       const cate_list=await category.category_schema_model.find({is_delete:false,is_list:false})
       

        res.render('product',{product,msg:req.flash('msg'),pages,currentPage:page,cate_list})
      }
      
    } catch (error) {
        console.log(error)
    }
}
module.exports=render_Product