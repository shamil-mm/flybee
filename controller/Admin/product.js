const categorySchema=require('../../models/categorySchema')
const productSchema=require('../../models/productSchema')
const paginate=require('../../functions/pagination')
const fs = require('fs');
const order=require('../../models/orderSchema')



const editProductPageRender=async(req,res)=>{
    try {
        const Data=await productSchema.add_pro_model.findOne({_id:req.query.id}).populate('category')
        const category=await categorySchema.category_schema_model.find({is_delete:false,is_list:false})
        
        
        res.render("adminEditproduct",{data:Data,category,msg:req.flash('msg')})
    } catch (error) {
       console.log('error') 
    }
}





const productPageRender=async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit =8;
        const Query = {is_delete:false}
        const finalData=await paginate(productSchema.add_pro_model,page,limit,Query)
        res.render('adminProducts',{data:finalData.results,totalPages:finalData.totalPages,currentPage:finalData.currentPage ,msg:req.flash("msg"),msg1:req.flash("msg1")})
        
    } catch (error) {
       console.log(error) 
    }
}

const productListUnlistLoader=async(req,res)=>{
    try {
        
       const checkData= await productSchema.add_pro_model.findOne({_id:req.query.id})
       if(checkData.is_list==false){

           const data= await productSchema.add_pro_model.updateOne({_id:req.query.id},{$set:{is_list:true}})
        }else if(checkData.is_list==true){
            const data= await productSchema.add_pro_model.updateOne({_id:req.query.id},{$set:{is_list:false}})
        }
       
    } catch (error) {
        console.log(error);
    }
}




const addProductPageRender=async(req,res)=>{
    try { 
        const products= await categorySchema.category_schema_model.find({is_delete:false,is_list:false})
        res.render('adminAddproduct',{category:products})
       
        
    } catch (error) {
        console.log(error)
    }
}


const addProductLoad=async(req,res)=>{
    try {

        let imgs=[]
        
        
        if(croppedimages){
            imgs=croppedimages
            croppedimages=null
        }else{
            for(i=0;i<req.files.length;i++){
                imgs.push(req.files[i].filename)
            }
        }
        const{title,size,brand,description,price,quantity}=req.body
        
        const product=new productSchema.add_pro_model({
            product_name:title,
            size:size,
            brand:brand,
            Description:description,
            image:imgs,
            price:price,
            stock:quantity,
          category:req.body.checkbox1
        })
        const repeat_data=await productSchema.add_pro_model.findOne({product_name:title})
        if(repeat_data){
            req.flash('msg',`product already existed`)    
            res.redirect('/admin/products')

        }else{ 
            const save_product= await product.save();
           await productSchema.add_pro_model.find({}).populate('category')
           req.flash('msg1',`Product saved successfully`) 
           res.redirect('/admin/products')
        }
       
        
    } catch (error) {
        console.log(error)
    }
}
    let croppedimages=[]
const imageUpload=async(req,res)=>{
    try {
        croppedimages.push(req.file.filename) 
        console.log(croppedimages)
    } catch (error) {
        console.log(error)
    }
}




const editProductLoad=async(req,res)=>{
    try {
       const{title,size,brand,description,price,quantity,checkbox1}=req.body
      
       
       const data= await productSchema.add_pro_model.findById(req.query.id)
       let imgs=data.image
       const existingProduct = await productSchema.add_pro_model.findOne({ product_name: title });
        if (existingProduct && existingProduct._id.toString() !== req.query.id) {
            req.flash('msg1', `A product with the same name already exists`);
            return res.redirect('/admin/products');
        }
        let newImages = [];
if (croppedimages) {
    newImages = croppedimages;
    croppedimages=null
} else if (req.files) {
    newImages = req.files.map(file => file.filename);
}
while (imgs.length + newImages.length > 3) {
    imgs.shift();
}
imgs = imgs.concat(newImages);

    
      
      if(!data){
         req.flash('msg1',`Product not found`)    
        res.redirect('/admin/products')
      }
      data.product_name=title;
      data.size=size;
      data.brand=brand;
      data.Description=description;
      data.image=imgs;
      data.price=price;
      data.stock=quantity;
      data.category=checkbox1;
      await data.save()
      req.flash('msg1',`Product updated successfully`)    
        res.redirect('/admin/products')
       
       
      
   
   }catch (error) {
       console.log(error)
    }
}



const deletedProductPageRender=async(req,res)=>{
    try {
        const data =await productSchema.add_pro_model.find({is_delete:true})
        
        res.render('Admindeletedproduct',{data})
    } catch (error) {
        console.log(error);
    }
}






const productDelete=async(req,res)=>{
    try { 
        const productCheckInOrder=await order.findOne({"OrderedProducts.productId":req.query.id})
       if(!productCheckInOrder){
           await productSchema.add_pro_model.updateOne({_id:req.query.id},{$set:{is_delete:true}}) 
           res.json({success:`product delete`})
       }else{
        res.json({fail:`product fount in order! You Cant't delete`})
       }
        } catch (error) {
        console.log(error)
    }
}

const productRecover=async(req,res)=>{
    try {
        await productSchema.add_pro_model.updateOne({_id:req.query.id},{$set:{is_delete:false}}) 
    } catch (error) {
        console.log(error);
    }
}


    const deleteProductPermanently=async(req,res)=>{
        try {
            const id=req.query.id
        const product = await productSchema.add_pro_model.findById(id)
        if (!product) {
            return res.status(404).json({ error: 'Product not found in aDloadP_delete page'});
        }
        const imageFilenames = product.image;
        imageFilenames.forEach(filename => {
            fs.unlinkSync( `public/proimgs/${filename}`);
        });
                 await productSchema.add_pro_model.deleteOne({_id:id})
          
        } catch (error) {
            console.log(error)
        }
    }



module.exports={addProductPageRender,productDelete,productPageRender,editProductPageRender,editProductLoad,deletedProductPageRender,productRecover,deleteProductPermanently,productListUnlistLoader,addProductLoad,imageUpload}