const Order=require('../../models/orderSchema')
const product_data=require('../../models/admin_pro_schema')
const removeproductorder=async(req,res)=>{
    try {
    const productId=req.query.id
    
  
    const userfind= await Order.findOne({userId:req.session.user_id}).populate('OrderedProducts.productId')
    const product=userfind.OrderedProducts.find((product)=>{
        return product._id==productId
    })
  
    const prochange=await product_data.add_pro_model.findOne({_id:product.productId._id})
    prochange.stock+=product.quantity
    await prochange.save()
    product.orderStatus='Canceled'
    await userfind.save()
     
    
    
    } catch (error) {
        console.log(error)
    }
}
module.exports=removeproductorder