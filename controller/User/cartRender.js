const Cart=require('../../models/cartSchema')
const cartRender=async(req,res)=>{
    try {
        
        if(req.session.user_id){

            const data=await Cart.findOne({userId:req.session.user_id}).populate('items.productId')
            
            if(data&&data.items!==null){
               
                res.render('cart',{data:data.items,productsFound:true,cart:req.flash('cart')}) 
            }else{
               
                let text='No products found in your cart. Add products...!';
                res.render('cart',{productsFound:false,message:text,cart:req.flash('cart')})
            }
             
    }
    else{
        res.redirect('/homePage')
       
    }
    } catch (error) {
        console.log(error)
    }
}
module.exports=cartRender