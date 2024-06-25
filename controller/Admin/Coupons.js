const coupon=require('../../models/couponSchema')
const paginate=require('../../functions/pagination')

const Coupons=async(req,res)=>{
    try {

        const page = parseInt(req.query.page) || 1;
        const limit =5;
        const Query = {}
        const finalData=await paginate(coupon,page,limit,Query)
       

        // const couponList=await coupon.find({})
        res.render('AdminCoupons',{couponlist:finalData.results,totalPages:finalData.totalPages,currentPage:finalData.currentPage,msg1:req.flash('msg1'),msg2:req.flash('msg2')})
    } catch (error) {
        console.log(error)
    }
}
const loadCoupon=async(req,res)=>{
    try {
        const {coupon_name,coupon_code,coupon_minAmount,coupon_maxAmount,coupon_discount,coupon_exDate,coupon_usageLimit,coupon_usageCount}=req.body
        const duplicateData=await coupon.findOne({code:coupon_code})
        
        if(!duplicateData){
        const couponData=new coupon({name:coupon_name,code:coupon_code,minAmount:coupon_minAmount,maxAmount:coupon_maxAmount,discountAmount:coupon_discount,expirationDate:coupon_exDate,usageLimit:coupon_usageLimit,usageCount:coupon_usageCount})
        await couponData.save()
        req.flash('msg1',"Coupon saved successfuly")
            res.redirect('/admin/Coupons')
        }else{ 
        req.flash('msg2',"Coupon already exist !")
        res.redirect('/admin/Coupons')
        }

    } catch (error) {
       console.log(error) 
    }
}
const couponEdit=async(req,res)=>{
    try {
        const coupon_id=req.query.id
        const data=await coupon.findOne({_id:coupon_id})
        res.render('couponEdit',{data})
    } catch (error) {
        console.log(error)
    }
}
const loadCouponEdit=async(req,res)=>{
    try {
        const coupon_id=req.query.id

        const {coupon_name,coupon_code,coupon_minAmount,coupon_maxAmount,coupon_discount,coupon_exDate,coupon_usageLimit,coupon_usageCount}=req.body
        const existingCoupon=await coupon.findOne({name:coupon_name})
       
        if(existingCoupon && existingCoupon._id.toString()!==coupon_id){
            req.flash('msg2',"Coupon already exist !")
        res.redirect('/admin/Coupons')
        return
        }
        const data = await coupon.findByIdAndUpdate(coupon_id,{name:coupon_name,code:coupon_code,minAmount:coupon_minAmount,maxAmount:coupon_maxAmount,discountAmount:coupon_discount,expirationDate:coupon_exDate,usageLimit:coupon_usageLimit,usageCount:coupon_usageCount},{ new: true });

       res.redirect('/admin/Coupons')
        
    } catch (error) {
        console.log(error)
    }
}
const couponDelete=async(req,res)=>{
    try {
       const coupon_id=req.query.id
       const existingCoupon = await coupon.findById(coupon_id);
       if (!existingCoupon) {
        req.flash('msg2',"Coupon not Fount !")
        res.redirect('/admin/Coupons')
        return
       }

       await coupon.findByIdAndDelete(coupon_id)
       
    } catch (error) {
        console.log(error)
    }
}
const couponlist_unlist=async(req,res)=>{
    try {
       const coupon_id=req.query.id
       const data=await coupon.findById({_id:coupon_id})
    if(data.status==true){
        await coupon.updateOne({_id:coupon_id},{$set:{status:false}})
    }else{
        await coupon.updateOne({_id:coupon_id},{$set:{status:true}})
    }

       
    } catch (error) {
        console.log(error)
    }
}

module.exports={Coupons,loadCoupon,couponEdit,loadCouponEdit,couponDelete,couponlist_unlist}