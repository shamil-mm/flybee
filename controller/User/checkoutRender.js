const Address=require('../../models/addressSchema')
const Cart=require('../../models/cartSchema')
const coupon=require('../../models/couponSchema')
const checkoutRender=async(req,res,next)=>{
    try {
        let user=req.session.user_id
        var totalPrice=0
        if (user){
            const datas=await Address.findOne({userId:req.session.user_id})
            const couponStatus = await coupon.findOne({ usageCount: { $elemMatch: { userId: req.session.user_id,used:false } } })
            const userfind=await Cart.findOne({userId:req.session.user_id}).populate('items.productId')
            let filteredItems=null
            if(userfind){
                filteredItems= userfind.items.filter((value)=>value.productId.stock>0)
                userfind.items=filteredItems
                const saved= await userfind.save()
            }
           
            if(datas&& datas.addresses!==null){
            if(!userfind){  
                res.render('checkout' ,{datas:datas,addressFound:true,edit:req.flash('edit'),product:[],total:totalPrice,order:req.flash('order'),Cmsg:req.flash('Cmsg'),Csmsg:req.flash('Csmsg'),couponStatus})
                return
            }

           const product= userfind.items.map((value)=>{
           if(value.productId.offerPercentage>0){
                totalPrice+=(value.productId.price-value.productId.price*(value.productId.offerPercentage/100))*value.quantity
                return value
            }else{
                totalPrice+=value.productId.price*value.quantity
                return value
            }
                
            })
        
            res.render('checkout' ,{datas:datas,addressFound:true,edit:req.flash('edit'),product:filteredItems,total:totalPrice,order:req.flash('order'),Cmsg:req.flash('Cmsg'),Csmsg:req.flash('Csmsg'),couponStatus})
            }else{
             console.log("address not okey")
             let text='No user adderss fount'
             res.render('checkout', { datas: datas, addressFound: false, message: text,product:filteredItems,total:totalPrice, edit: req.flash('edit'),order:req.flash('order'),Cmsg:req.flash('Cmsg'),Csmsg:req.flash('Csmsg'),couponStatus});
            }
         }else{
           
             res.redirect('/homePage')
         }
       
    } catch (error) {
      next(error) 
    }
}
module.exports=checkoutRender