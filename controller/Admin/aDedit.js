const { query } = require('express')
const add_pro=require('../../models/admin_pro_schema')
const aDedit=async(req,res)=>{
    try {
       const{title,size,brand,description,price,quantity,checkbox1}=req.body
       const imgs=[]
       
       req.files.map((value)=>imgs.push(value.filename))
       const data= await add_pro.add_pro_model.findById(req.query.id)
      
    
      
      if(!data){
         req.flash('msg1',`Product not found`)    
        res.redirect('/admin/products')
      }
      data.product_name=title;
      data.size=size;
      data.brand=brand;
      data.Description=description;
      if(data.image){
         data.image
      }else{
         data.image=imgs
      }
      data.price=price;
      data.quantity=quantity;
      data.category=checkbox1;
      await data.save()
      req.flash('msg1',`Product updated successfully`)    
        res.redirect('/admin/products')
       
       
      
   
   }catch (error) {
       console.log(error)
    }
}
module.exports=aDedit