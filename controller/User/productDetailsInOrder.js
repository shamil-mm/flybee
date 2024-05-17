const Order=require('../../models/orderSchema')
const productDetailsInOrder=async(req,res)=>{
    try {
       
     const objId=req.query.id
    const data= await Order.findOne({userId:req.session.user_id}).populate('OrderedProducts.productId')
        const result=data.OrderedProducts.filter((value)=>{
            return value._id==objId
        })
       console.log(result)
       res.send({result})
      
      
    } catch (error) {
        console.log(error)
    }
}
module.exports=productDetailsInOrder