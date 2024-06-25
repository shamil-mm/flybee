const productSchema=require('../../models/productSchema')
const category=require('../../models/categorySchema')
const Offer=require('../../models/offerSchema')
const offerHelper=require('../../functions/offerCalculations')


const productPageRender=async(req,res)=>{
    try {
        const limit=8;
        const page=Number(req.query.page)||1
        const skip=(page-1)*limit
        const count= await productSchema.add_pro_model.find({is_delete:false,is_list:false}).populate('category').countDocuments()
        const pages=Math.ceil(count/limit)


      const product= await productSchema.add_pro_model.find({is_delete:false,is_list:false}).populate('category').limit(limit*1).skip((page-1)*limit)
     
      if(req.session.sort !== undefined ){
        res.render('product',{product:req.session.sort,msg:req.flash('msg'),pages,currentPage:page,cate_list:[]})
      }else{
       const cate_list=await category.category_schema_model.find({is_delete:false,is_list:false})


        // ---------------------------------------------------------------------
        
        const productWithOffer= await Promise.all(product.map(async(product)=>{
          let finalPercentage=0
          let productOffer = 0;
          let categoryOffer = 0;

          const activeProductOffers = await offerHelper.getActiveProductOffers(product._id)
          const activeCategoryOffers = await offerHelper.getActiveCategoryOffers(product.category._id)

            if(activeProductOffers.length>0){

              activeProductOffers.forEach((offer)=>{
                const offerAmount =offer.offerPrecentage;
                productOffer = Math.max(productOffer, offerAmount);
               })
            }


            if(activeCategoryOffers.length>0){
              activeCategoryOffers.forEach((offer)=>{
              const offerAmount = offer.offerPrecentage;
              categoryOffer = Math.max(categoryOffer, offerAmount);
           
              })
            }
            finalPercentage=productOffer>categoryOffer?productOffer:categoryOffer
            const updated_data=await productSchema.add_pro_model.findByIdAndUpdate(product._id, {offerPercentage:finalPercentage}, {new: true});
         return {...product.toObject(),finalPercentage}

        }))
        // ---------------------------------------------------------------------
        res.render('product',{product:productWithOffer,msg:req.flash('msg'),pages,currentPage:page,cate_list})
      }
      
    } catch (error) {
        console.log(error)
    }
}



const mensPageRender=async(req,res)=>{
    try {
      const data= await productSchema.add_pro_model.find({}).populate("category")
    const menProducts=data.filter((product)=>{
        return product.category.name=="Men's"
    })
    
       res.render('mens',{men:menProducts}) 
    } catch (error) {
        console.log(error);
    }
}
const womensPageRender=async(req,res)=>{
  try {
      const data=await productSchema.add_pro_model.find({}).populate('category')
      const womensproduct=data.filter((product)=>{
          return product.category.name=="Women's"
      })
     
      res.render('womens',{women:womensproduct})
  } catch (error) {
      console.log(error);
  }
}


const productViewPage=async(req,res)=>{
    try {
        const id =req.query.id
       const singleData= await productSchema.add_pro_model.findOne({_id:id}).populate('category')
     res.render('productView',{singleData})
    } catch (error) {
        console.log(error);
    }
}

module.exports={productPageRender,mensPageRender,womensPageRender,productViewPage}