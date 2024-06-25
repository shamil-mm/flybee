const productSchema=require('../../models/productSchema')
const Cart=require('../../models/cartSchema')


const addToCart=async(req,res)=>{
       
    try {
        const userId=req.session.user_id
       if(userId){ 
        const product=await productSchema.add_pro_model.findOne({_id:req.query.id})
        let cart=await Cart.findOne({userId})
        if(product.stock>0){

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
        req.flash('msg','product out of stock')
        res.redirect('/product')
        
    }
        }
    else{
        res.redirect('/homePage')
    }
    } catch (error) {
        console.log(error)
    }
}



const cartRender=async(req,res)=>{
    try {
        
        if(req.session.user_id){

            const data=await Cart.findOne({userId:req.session.user_id}).populate('items.productId')
            
            if(data&&data.items!==null){
                const filteredItems=data.items.filter((value)=>value.productId.stock>0)
                data.items=filteredItems
                await data.save()
               
                res.render('cart',{data:filteredItems,productsFound:true,cart:req.flash('cart')}) 
            }else{
               
                let text='No products found in your cart. Add products...!';
                res.render('cart',{data:[],productsFound:false,message:text,cart:req.flash('cart')})
            }   
    }
    else{
        res.redirect('/homePage')
       
    }
    } catch (error) {
        console.log(error)
    }
}


const cartQuantityDynamic=async(req,res)=>{
    try {

        if(req.session.user_id){
            const productId=req.query.id
            const quantity=req.query.value

            

        const data=await Cart.findOne({userId:req.session.user_id})
      const isMatch=  data.items.find((value)=>{
            return value.productId.equals(productId)
        })
       const checkQuantity= await productSchema.add_pro_model.findOne({_id:isMatch.productId})
        if(checkQuantity.stock<quantity){
            res.json({msg:'only'+(quantity-1)+' stocks availiable',stock:checkQuantity.stock})
            return
        }
        
        isMatch.quantity=quantity
        data.save()
        }else{
            res.redirect('/homePage')
        }
        
    } catch (error) {
        console.log(error)
    }
}

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

module.exports={addToCart,cartRender,cartQuantityDynamic,removeCartProduct}