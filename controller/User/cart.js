const {Product}=require('../../models/productSchema')
const Cart=require('../../models/cartSchema')


const addToCart=async(req,res,next)=>{
       
    try {
        const userId=req.session.user_id
       if (!userId) return res.redirect('/');

       const { id: productId, variant: variantId } = req.query;
       
        const product=await Product.findOne({_id:productId})

        if (!product) {
        req.flash('msg', 'Product not found');
        return res.redirect('/product');
        }

        const selectedVariant = product.variants.id(variantId);

        if (!selectedVariant) {
        req.flash('msg', 'Variant not found');
        return res.redirect('/product');
        }

        if (selectedVariant.stock <= 0) {
        req.flash('msg', 'Variant out of stock');
        return res.redirect('/product');
        }

        let cart=await Cart.findOne({userId})

        if(!cart){
            cart=new Cart({userId,
                items:[{ productId,variantId,quantity:1,}]
            })
            await cart.save()  
            req.flash('cart', 'Product added to cart');
            return res.redirect('/cart')
        }

             const existingItem = cart.items.find(item =>item.productId.equals(productId) && item.variantId.equals(variantId));
            if(existingItem){
                req.flash('msg','product already exixted in cart')
                return res.redirect('/product')
            }
                
                cart.items.push({productId,variantId,quantity: 1});
                await cart.save()
                req.flash('cart','product saved in cart')
                return res.redirect('/cart') 
    } catch (error) {
       next(error)
    }
}
const cartRender=async(req,res,next)=>{
    try {
        if(!req.session.user_id){
            return res.redirect('/#signin-modal');
        }
            const errorMessage = req.flash('error');
            const cart =await Cart.findOne({userId:req.session.user_id}).populate('items.productId')
            if(!cart || cart.items.length===0){
                return res.render('cart',{data:[],productsFound:false,message:'No products found in your cart. Add products...!',cart:req.flash('cart'),error: errorMessage})
            }
            const cartItems=cart.items.map(item=>{
                const product=item.productId;
                if(!product)return null;
                const variant=product.variants.id(item.variantId);
                if(!variant || variant.stock<=0) return null;
                return {
                    cartItemId: item._id,
                    productId: product._id,
                    productName: product.product_name,
                    offerPercentage:product.offerPercentage,
                    brand: product.brand,
                    quantity: item.quantity,
                    variantId: variant._id,
                    price: variant.price,
                    stock: variant.stock,
                    size: variant.size,
                    color: variant.color,
                    image: variant.images?.[0] || product.images?.[0]
                }
            }).filter(Boolean)

            if(cartItems.length===0){
                return res.render('cart', {
                data: [],
                productsFound: false,
                message: 'All items in your cart are out of stock.',
                cart: req.flash('cart'),
                error: errorMessage
            });
            }

                res.render('cart', {
                data: cartItems,
                productsFound: true,
                cart: req.flash('cart'),
                error: errorMessage
                });

    } catch (error) {
       next(error)
    }
}


const cartQuantityDynamic=async(req,res,next)=>{
    try {

        if(req.session.user_id){
            const productId=req.query.id
            const quantity=req.query.value

            const cartItems=await Cart.findOne({userId:req.session.user_id})
           
            const matchItem=  cartItems.items.find((value)=>{
                return value.productId.equals(productId)
            })

            const product= await Product.findOne({_id:matchItem.productId})
            const variant=product.variants.id(matchItem.variantId)
        if(variant.stock<quantity){
            return res.json({msg:'only'+(quantity-1)+' stocks availiable',stock:variant.stock})
            
        }
        
        matchItem.quantity=quantity
        cartItems.save()
        }else{
            res.redirect('/')
        }
        
    } catch (error) {
       next(error)
    }
}

const removeCartProduct=async(req,res,next)=>{
    try {
        
       if(req.session.user_id) {
        const removeData=await Cart.findOne({userId:req.session.user_id})
        const findData= removeData.items.find((value)=>{
        return value.productId.equals(req.query.id)
        })
        removeData.items=removeData.items.filter(items=>!items.productId.equals(findData.productId))
        removeData.save()
    }else{
        res.redirect('/')
    }
    } catch (error) {
       next(error)
    }
}

module.exports={addToCart,cartRender,cartQuantityDynamic,removeCartProduct}