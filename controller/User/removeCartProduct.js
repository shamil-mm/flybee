const Cart=require('../../models/cartSchema')
const removeCartProduct=async(req,res)=>{
    try {
        
       if(req.session.user_id) {
        const removeData=await Cart.findOne({userId:req.session.user_id})
       const findData= removeData.items.find((value)=>{
            return value.productId.equals(req.query.id)
        })
        removeData.items=removeData.items.filter(items=>!items.productId.equals(findData.productId))
        removeData.save()
    }else{
        res.redirect('/homePage')
    }
    } catch (error) {
        console.log(error)
    }
}
module.exports=removeCartProduct