const Cart=require('../../models/cartSchema')
const product_data=require('../../models/admin_pro_schema')
const Address=require('../../models/userAddress')
const Order=require('../../models/orderSchema')
const order=async(req,res)=>{
    try {
        console.log(req.query)
        const userId=req.session.user_id
        const userfind=await Cart.findOne({userId:req.session.user_id}).populate('userId').populate("items.productId")
        const products=userfind.items
        const orderproducts=[]
        const addressId=req.query.id
        let total=parseInt(req.query.total)
        if(total<50000){
            total+=100
        }
        const productdata = await product_data.add_pro_model.find({})
        const find_user=await Address.findOne({userId:req.session.user_id})
        const find_result=find_user.addresses.find((value)=>{
            return value._id==addressId
          })
          
        products.forEach((product)=>{
          const data =   productdata.find((value)=>{
                return value._id.equals(product.productId._id)
            })
            data.stock = data.stock - product.quantity
            data.save();
           orderproducts.push({productId:data._id,quantity:product.quantity,shippingAddress:find_result})
        })
      const OrderFound=await Order.findOne({userId:req.session.user_id})
    if(!OrderFound){
    const order=new Order({
        userId:req.session.user_id,
        OrderedProducts:orderproducts
    })
    order.save()
  
   await Cart.findOneAndDelete({ userId: req.session.user_id })
    req.flash('order',"order")
    res.redirect('/checkout')
}else{
   await Order.findOneAndUpdate({userId:req.session.user_id},{$push:{OrderedProducts:orderproducts}})
   const data=await Order.findOne({userId:req.session.user_id})
  
   data.orderAmount+=total
   await data.save()
   await Cart.findOneAndDelete({ userId: req.session.user_id })
   req.flash('order',"order")
   res.redirect('/checkout')
}
} catch (error) {
        console.log(error)
    }
}
module.exports=order