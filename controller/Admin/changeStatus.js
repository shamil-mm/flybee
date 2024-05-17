const Order=require('../../models/orderSchema')
 const add_pro=require('../../models/admin_pro_schema')
const changeStatus=async(req,res)=>{
    try {
   

    const { id: special_id, value: currentSelection } = req.query;
  const orders = await Order.find({'OrderedProducts._id': special_id }).populate('OrderedProducts.productId')
  
    for (const order of orders) {
   
     const orderedProduct = order.OrderedProducts.find(product => product._id.equals(special_id));
     
    if (orderedProduct) {
        
            
        orderedProduct.orderStatus=currentSelection;
        await order.save();
            if(currentSelection==='Canceled'){
                
                orderedProduct.productId.stock+=orderedProduct.quantity
               const x= await add_pro.add_pro_model.findOneAndUpdate({_id:orderedProduct.productId},{$set:{stock:orderedProduct.productId.stock}},{new:true})
              
               
            }
          
            
            
            
        }
    }    
    } catch (error) {
      console.log(error)  
    }
}
module.exports=changeStatus