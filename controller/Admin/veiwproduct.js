const Order=require('../../models/orderSchema')
const veiwproduct=async(req,res)=>{
    try {
       

      
       const special_id = req.query.id;
       const orderWithProduct = await Order.find({'OrderedProducts._id':special_id}).populate('OrderedProducts.productId')
       orderWithProduct.forEach((value)=>{
        const orderedProduct= value.OrderedProducts.find(product => product._id.equals(special_id));
             res.send(orderedProduct);
       })
   
       
    } catch (error) {
       console.log(error) 
    }
  }
  module.exports=veiwproduct