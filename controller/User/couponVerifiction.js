const coupon=require('../../models/couponSchema')
const Order=require('../../models/orderSchema')
const couponVerifiction=async(req,res,next)=>{
    try {
        const inputCode=req.body.coupon_code
        const purchaseAmount= req.query.total
       
      
        
        const verified=await coupon.findOne({code:inputCode})
        if(!verified){
            req.flash('Cmsg','invalid coupon code')
            res.redirect('/checkout')
            return
        }
        if(new Date()>verified.expirationDate){
            
            req.flash('Cmsg','coupon has expired')
            res.redirect('/checkout')
            return
        }
        if(!verified.status){
           
            req.flash('Cmsg','coupon is inactive')
            res.redirect('/checkout')
            return
        }
        
        if(verified.usageCount.length>=verified.usageLimit){
         
            req.flash('Cmsg','Coupon usage limit reached')
            res.redirect('/checkout')
            return
        }
        if (purchaseAmount < verified.minAmount || purchaseAmount > verified.maxAmount) {
            
            req.flash('Cmsg',`Purchase amount must be between ${verified.minAmount} and ${verified.maxAmount}`)
            res.redirect('/checkout')
            return
          }
        const checkUser=verified.usageCount.find((value)=>{ 
            return value.userId.equals(req.session.user_id)
         
        })

        if(!checkUser){
        const discountAmount=verified.discountAmount
        verified.usageCount.push({userId:req.session.user_id})
        verified.save()
        req.flash('Csmsg',`Coupon Applied !`)
        res.redirect('/checkout')
        }else{
            req.flash('Cmsg',`coupon already applied once`)
            res.redirect('/checkout')
        }
      
        
    } catch (error) {
        next(error)
    }
}
const removeCoupon=async(req,res,next)=>{
    try {
        const couponId=req.query.id
        await coupon.updateOne({_id:couponId},{$pull:{usageCount:{userId:req.session.user_id}}});
    } catch (error) {
        next(error)
    }
}

const fetchAvaliableCoupon=async(req,res,next)=>{
    try {
        const { datas } = req.body;
        const productArray=JSON.parse(datas)
        let priceOfProduct=0
        let totalPrice=0
        productArray.forEach(element => {
          
            if(element.productId.offerPercentage>0){
                priceOfProduct=  element.productId.price-element.productId.price*(element.productId.offerPercentage/100)
            }else{
                priceOfProduct= element.productId.price
            }
            totalPrice+=priceOfProduct
        });
        
        const allCoupon=await coupon.find({status:true, minAmount:{$lte:totalPrice},maxAmount:{$gte:totalPrice},expirationDate:{$gte:new Date()}})
        
        res.json(allCoupon)


       
    } catch (error) {
       next(error) 
    }
}
module.exports={couponVerifiction,removeCoupon,fetchAvaliableCoupon}