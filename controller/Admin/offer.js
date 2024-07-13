const product=require('../../models/productSchema')
const category=require('../../models/categorySchema')
const Offer=require('../../models/offerSchema')
const offerRender=async(req,res)=>{
    try {
        const fullListOfOffer=await Offer.find({}).populate('productId').populate('categoryId')
        res.render('adminOffers',{offers:fullListOfOffer,msg:req.flash('msg')})
    } catch (error) {
        console.log(error)
    }
}
const showProductlist=async(req,res)=>{
    try {
        if(req.query.offerType!==undefined&&req.query.offerType=='Product'){
       const productList=await product.add_pro_model.find({is_list:false,is_delete:false})
       const productNames=productList.map((value)=>(value.product_name))
        res.json(productNames)
        }else if(req.query.offerType!==undefined&&req.query.offerType=='Category'){
            const categoryList=await category.category_schema_model.find({is_list:false,is_delete:false})
            const categoryNames=categoryList.map((value)=>(value.name))
        res.json(categoryNames)
        
        }
       
    } catch (error) {
        console.log(error) 
    }
}
const offerLoad=async(req,res)=>{
    try {
       const { OfferType,OfferName,name,amount,startDate,expireDate}=req.body
      if(OfferType=='Product'){
            const productFound=await product.add_pro_model.findOne({product_name:name})
            const offerExists = await Offer.findOne({ name: OfferName });
                if (offerExists) {
                    req.flash('msg', 'An offer with this name already exists for the specified product');
                    return res.redirect('/admin/offers');
                }
            if(productFound){
                
                const offer=new Offer({
                    name:OfferName,
                    productId:productFound._id,
                    offerPrecentage:amount,
                    startingDate:startDate,
                    expiryDate:expireDate
                })
                await offer.save();
                res.redirect('/admin/offers');

            }else{
                req.flash('msg','Product not fount in product list')
                res.redirect('/admin/offers');

            }
         }else if(OfferType=='Category'){
            const categoryFound=await category.category_schema_model.findOne({name})
            if(categoryFound){
                const offer=new Offer({
                    name:OfferName,
                    categoryId:categoryFound._id,
                    offerPrecentage:amount,
                    startingDate:startDate,
                    expiryDate:expireDate
                })
                await offer.save();
                categoryFound.offerPercentage=amount
                await categoryFound.save()

                res.redirect('/admin/offers');

            }else{
                req.flash('msg','Category not fount in category list')
                res.redirect('/admin/offers');
            }

         }
       
    } catch (error) {
        console.log(error)
    }
}
const loadEditOffer=async(req,res)=>{
    try {
        const { OfferType,OfferName,name,amount,startDate,expireDate}=req.body
        console.log(req.query.id)
        const duplicateOffer = await Offer.findOne({
            name: OfferName,
            _id: { $ne: req.query.id } 
        });

        if (duplicateOffer) {
            req.flash('msg', 'An offer with this name already exists');
            return res.redirect('/admin/offers');
        }
        if (OfferType === 'Product') {
            const producFound=await product.add_pro_model.findOne({product_name:name})
            const updatedData = await Offer.findOneAndUpdate(
                {_id:req.query.id},
                {
                    name:OfferName,
                    productId:producFound._id,
                    offerPrecentage:amount,
                    startingDate:startDate,
                    expiryDate:expireDate
                },
                { new: true }
            ).populate('productId');
            if (updatedData) {
                req.flash('msg1','Offer updated')
                res.redirect('/admin/offers');
            } else {
                req.flash('msg','Offer not updated')
                res.redirect('/admin/offers');
            }
           
        } else if (OfferType === 'Category') {
            const categoryFound=await category.category_schema_model.findOne({name})
            const updatedData = await Offer.findOneAndUpdate(
                {_id:req.query.id},
                {
                    name:OfferName,
                    categoryId:categoryFound._id,
                    offerPrecentage:amount,
                    startingDate:startDate,
                    expiryDate:expireDate
                },
                { new: true }
            ).populate('categoryId')
        
        if (updatedData) {
            req.flash('msg1','Offer updated')
            res.redirect('/admin/offers');
        } else {
            req.flash('msg','Offer not updated')
            res.redirect('/admin/offers');
        }
    }
    } catch (error) {
        console.log(error)
    }
}
const editOffer=async(req,res)=>{
    try {
        const offerId=req.query.id
        const findOffer=await Offer.findById(offerId).populate('productId').populate('categoryId')
       res.render('EditOffer',{findOffer,msg:req.flash('msg'),msg1:req.flash('msg1')})
    } catch (error) {
        console.log(error)
    }
}
const offerDelete=async(req,res)=>{
    try {
        const offerId=req.query.id
        var status=req.query.status
        if(status=="Unlist"){
            const findOffer = await Offer.findByIdAndUpdate(
                offerId,
                { $set: { isList: true } }, 
                { new: true } 
            ).populate('productId').populate('categoryId');

        }else if(status=="List"){
            const findOffer = await Offer.findByIdAndUpdate(
                offerId,
                { $set: { isList: false } }, 
                { new: true } 
            ).populate('productId').populate('categoryId');
        
        
        }

        
       
    } catch (error) {
        console.log(error)
    }
}
module.exports={offerRender,showProductlist,offerLoad,loadEditOffer,editOffer,offerDelete}