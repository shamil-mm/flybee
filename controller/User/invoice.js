
const Order=require('../../models/orderSchema')

const invoiceRender=async(req,res,next)=>{
    try {
        if(req.session.user_id){
            const id=req.query.id
            const orderList = await Order.findOne({ userId: req.session.user_id,'OrderedProducts._id': id}).populate({path: 'OrderedProducts.productId',populate: {path: 'category'}});
            res.render('invoice',{order:orderList,address:orderList.OrderedProducts[0].shippingAddress})

        }else{
            res.redirect('/')
        }
        
    } catch (error) {
        next(error)
    }
}
const downloadInvoice=async(req,res,next)=>{
    try {
        
        
    } catch (error) {
        next(error)
    }
}


module.exports={invoiceRender,downloadInvoice}