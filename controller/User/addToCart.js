const product_data=require('../../models/admin_pro_schema')
const Cart=require('../../models/cartSchema')

const addToCart=async(req,res)=>{
    try {
        const userId=req.session.user_id
        const product=await product_data.add_pro_model.findOne({_id:req.query.id})
        let cart=await Cart.findOne({userId})
       if(userId){ 
        if(!cart){
          
            cart=new Cart({userId:userId,
                items:{ productId:product._id,
                        quantity:1,
                        
               }
            })
            
            await cart.save()
            
            res.redirect('/cart')
        }else if(cart){
            
            const existingItem=cart.items.find(ones=>ones.productId.equals(product._id))
            if(existingItem){
             
                req.flash('msg','product already exixted')
                res.redirect('/product')
            }else{
                
                cart.items.push({ productId:product._id, quandity:1})
                cart.save()
                req.flash('cart','product saved in cart')
                res.redirect('/cart')
            }
          
        }
    }else{
        res.redirect('/homePage')
    }
    } catch (error) {
        console.log(error)
    }
}
module.exports=addToCart