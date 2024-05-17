const add_pro=require('../../models/admin_pro_schema')

const loadProduct=async(req,res)=>{
    try {
        
       
        const{title,size,brand,description,price,quantity}=req.body
        const imgs=[]
        for(i=0;i<req.files.length;i++){
            imgs.push(req.files[i].filename)
        }
        
        const product=new add_pro.add_pro_model({
            product_name:title,
            size:size,
            brand:brand,
            Description:description,
            image:imgs,
            price:price,
            stock:quantity,
          category:req.body.checkbox1
        })
        const repeat_data=await add_pro.add_pro_model.findOne({product_name:title})
        if(repeat_data){
            req.flash('msg',`product already existed`)    
            res.redirect('/admin/products')

        }else{ 
            const save_product= await product.save();
           await add_pro.add_pro_model.find({}).populate('category')
           res.redirect('/admin/products')
        }
       
        
    } catch (error) {
        console.log(error)
    }
}
module.exports=loadProduct