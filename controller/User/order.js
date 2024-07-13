
const Cart=require('../../models/cartSchema')
const productSchema=require('../../models/productSchema')
const Address=require('../../models/addressSchema')
const Order=require('../../models/orderSchema')
const coupon=require('../../models/couponSchema')
const Category=require('../../models/categorySchema')


const orderCreation=async(req,res,next)=>{
    try {
       
       
       const amountTotal=req.query.total
       const userId=req.session.user_id
       const couponId=req.query.couponId
       const couponpercentage=req.query.couponpercentage
       const userfind=await Cart.findOne({userId:userId}).populate('userId').populate("items.productId")
       if(!userfind.items){
            res.status(400).json({ title: "info",text:"product not found" ,icon:'error'});
        }
        const products=userfind.items
        const orderproducts=[]
        const addressId=req.query.id
        const productdata = await productSchema.add_pro_model.find({})
        const find_user=await Address.findOne({userId:userId})


        const find_result=find_user.addresses.find((value)=>{
            return value._id.equals(addressId)
          })
        let stockOut=false
           

        if(req.query.payment){
            for (const product of products) {
                    const data =   productdata.find((value)=>{
                    return value._id.equals(product.productId._id)
                })
               
                
                
                if(data.stock!==0 && data.stock>product.quantity){
                  data.stock = data.stock - product.quantity
                }else{  
                    stockOut=true     
                }

                const cate= await Category.category_schema_model.findOne({_id:data.category})
                const copyProduct={ 
                  _id:data._id,
                  product_name:data.product_name,
                  size:data.size,
                  brand:data.brand,
                  Description:data.Description,
                  image:data.image,
                  price:data.price,
                  stock:data.stock,
                  category:cate,
                  offerPercentage:data.offerPercentage
               
               }

                data.save();
                if(!req.query.paymentStatus){
                    orderproducts.push({productId:copyProduct,quantity:product.quantity,shippingAddress:find_result,paymentMethod:"Rasorpay",paymentStatus:'Paid'})
                }else{
                    orderproducts.push({productId:copyProduct,quantity:product.quantity,shippingAddress:find_result,paymentMethod:"Rasorpay",paymentStatus:'Failed',orderStatus:'Pending'})
                }
            }  
           }else if(req.query.Wallet){
            for (const product of products) {
                const data =   productdata.find((value)=>{
                return value._id.equals(product.productId._id)
                })
                  if(data.stock!==0 && data.stock>product.quantity){
                    data.stock = data.stock - product.quantity
                  }else{  
                      stockOut=true                      
                  }
  
                  const cate= await Category.category_schema_model.findOne({_id:data.category})
                  const copyProduct={ 
                    _id:data._id,
                    product_name:data.product_name,
                    size:data.size,
                    brand:data.brand,
                    Description:data.Description,
                    image:data.image,
                    price:data.price,
                    stock:data.stock,
                    category:cate,
                    offerPercentage:data.offerPercentage
                 
                 }
  
                  data.save();
                   orderproducts.push({productId:copyProduct,quantity:product.quantity,shippingAddress:find_result,paymentMethod:"Wallet",paymentStatus:'Paid'})
                 
              }
              
             


           }else{
           
            for (const product of products) {
              const data =   productdata.find((value)=>{
                    return value._id.equals(product.productId._id)
                })
                if(data.stock!==0 && data.stock>product.quantity){
                 
                data.stock = data.stock - product.quantity
              }else{
                stockOut=true 
                
              }
              const cate= await Category.category_schema_model.findOne({_id:data.category})
              const copyProduct={ 
                _id:data._id,
                product_name:data.product_name,
                size:data.size,
                brand:data.brand,
                Description:data.Description,
                image:data.image,
                price:data.price,
                stock:data.stock,
                category:cate,
                offerPercentage:data.offerPercentage
             
             }
              data.save();
               orderproducts.push({productId:copyProduct,quantity:product.quantity,shippingAddress:find_result})
            }
           }

           if(stockOut==false){
            const order=new Order({
                userId:req.session.user_id,
                OrderedProducts:orderproducts,
                TotalAmount:amountTotal,
                couponPercentage:couponpercentage
            })
            order.save()
           await Cart.findOneAndDelete({ userId: req.session.user_id })
           await coupon.updateOne(
            { _id: couponId, 'usageCount.userId': req.session.user_id },
            { $set: { 'usageCount.$.used': true } }
          )
          res.status(200).json({ title: "Order success",text:"Product ordered successfully",icon:'success'});

           }else{
            res.status(400).json({ title: "Order canceled",text:"Product out of stock" ,icon:'error'});
           }

    
    
} catch (error) {
        next(error)
    }
}

const productDetailsInOrder=async(req,res,next)=>{
    try { 
     const objId=req.query.id
     const data= await Order.find({userId:req.session.user_id}).populate('OrderedProducts.productId')
   
   
    if(data){
        let result
        data.forEach((value)=>{
           result=value.OrderedProducts.filter((value)=>{
            return value._id==objId
        })
       
        if(result.length==1){
            res.send({result}) 
        }
        })
        
    }
       
      
      
    } catch (error) {
        next(error)
    }
}


const orderTimeUpdateAddress=async(req,res,next)=>{
    try {
        const{name,country,address,city,state,pincode,phone,email}=req.body
        const data=await Address.findOne({userId:req.session.user_id})
        const data1= data.addresses.find((value)=>{
            return value._id.equals(req.query.id)
        })
  
        data1.name=name;
        data1.address=address;
        data1.email=email;
        data1.country=country;
        data1.city=city;
        data1.state=state;
        data1.pincode=pincode;
        data1.phone=phone;
        data.save()
        res.redirect('/personalInfo')
    } catch (error) {
        next(error);
    }
}



const orderTimeDeleteAddress=async(req,res,next)=>{
    try {
       await Address.findOneAndUpdate({userId:req.session.user_id},{$pull:{addresses:{_id:req.query.id}}})
       res.redirect('/personalInfo')
    } catch (error) {
        next(error)
    }
}

const reasonSubmit=async(req,res,next)=>{
    try {
     
       const reason=req.body.reason
       const orderId=req.query.orderId
       
        await Order.findOneAndUpdate({userId:req.session.user_id,"OrderedProducts._id":orderId},{$set:{'OrderedProducts.$.cancellationReason':reason}})
        req.flash('pass','Return Requested to the admin')
        res.redirect('/personalInfo')
    } catch (error) {
        next(error)
    }
}
const failedPayNow=async(req,res,next)=>{
    try {
        const orderId=req.query.id
        const data= await Order.findOne({userId:req.session.user_id,"OrderedProducts._id":orderId})
        res.json({data})  
    } catch (error) {
        next(error)
    }
}
const failedPaymentRetry=async(req,res,next)=>{
    try {
        const orderId=req.query.id
        const data= await Order.findOne({userId:req.session.user_id,"OrderedProducts._id":orderId})
        if (data){
            const productsPay=data.OrderedProducts
            if(productsPay){
                for(products of productsPay){
                    products.orderStatus='Placed'
                    products.paymentStatus='Paid'
                    await data.save()
                    res.json({status:"Payment Success"});
                }
            }else{
                res.status(404).send("Product not found.");
            }
        }else{
            res.status(404).send("order not found.");
        }
        
    } catch (error) {
        next(error)
    }
}



module.exports={orderCreation,productDetailsInOrder,orderTimeUpdateAddress,orderTimeDeleteAddress,reasonSubmit,failedPayNow,failedPaymentRetry}