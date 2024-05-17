const Order=require('../../models/orderSchema')
const aDorder=async(req,res)=>{
    try {
       const orderData= await Order.find({}).populate('OrderedProducts.productId')
       
        const data=orderData.map((value)=>{
          return value.OrderedProducts
        })
        const orderD=data.flat()
        res.render('adminOrders',{all:orderD,view:req.flash("view")})
        
    } catch (error) {
        console.log(error)
    }
}
module.exports=aDorder