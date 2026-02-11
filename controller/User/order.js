const mongoose = require("mongoose");
const Cart=require('../../models/cartSchema')
const {Product}=require('../../models/productSchema')
const Address=require('../../models/addressSchema')
const Order=require('../../models/orderSchema')
const coupon=require('../../models/couponSchema')
const {Category}=require('../../models/categorySchema')


const orderCreation = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log('order creation is working ')
    const userId = req.session.user_id;
    const {
      total,
      couponId,
      couponpercentage,
      id: addressId,
      payment,
      Wallet,
      paymentStatus
    } = req.query;


    const cart = await Cart.findOne({ userId }).populate("items.productId") .session(session)

    if (!cart || cart.items.length === 0) {
     throw new Error("CART_EMPTY");
    }

    let removed = false;
    cart.items = cart.items.filter(item => {
        const product = item.productId;
        if (!product) {
          removed = true;
          return false;
        }

        const variant = product.variants.id(item.variantId);
        if (!variant) {
          removed = true;
          return false;
        }

        return true;
      });

      if (removed) {
        await cart.save();
        throw new Error("INVALID_CART_ITEMS");
      }

    const addressDoc = await Address.findOne({ userId }).session(session)
    const shippingAddress = addressDoc.addresses.find(addr =>
      addr._id.equals(addressId)
    );

    if (!shippingAddress) {
      throw new Error("ADDRESS_NOT_FOUND");
    }

    let paymentMethod = "cash on delivery";
    let finalPaymentStatus = "Not paid";

    if (payment) {
      paymentMethod = "Rasorpay";
      finalPaymentStatus = paymentStatus ? "Failed" : "Paid";
    } else if (Wallet) {
      paymentMethod = "Wallet";
      finalPaymentStatus = "Paid";
    }

    const orderedProducts = [];


    for (const item of cart.items) {

      const stockResult = await Product.updateOne(
        {
          _id: item.productId._id,
          "variants._id": item.variantId,
          "variants.stock": { $gte: item.quantity }
        },
        {
          $inc: { "variants.$.stock": -item.quantity }
        },
        { session }
      ); 

      if (stockResult.modifiedCount === 0) {
        throw new Error("OUT_OF_STOCK");
      }

      const product = await Product.findById(item.productId._id).session(session);

      const variant = product.variants.id(item.variantId);

      orderedProducts.push({
        productId: product._id,
        variantId: variant._id,
        productName: product.product_name,
        brand: product.brand,
        size: variant.size,
        color: variant.color,
        price: variant.price,
        image: variant.images?.[0],
        quantity: item.quantity,
        offerPercentage: product.offerPercentage || 0,
        category:product.category
      });
    }
    

    
    const order = new Order({
      userId,
      OrderedProducts: orderedProducts,
      shippingAddress,
      paymentMethod,
      paymentStatus: finalPaymentStatus,
      TotalAmount: total,
      couponPercentage: couponpercentage || 0
    });

    await order.save();

    await Cart.findOneAndDelete({ userId }).session(session);
    

    if (couponId) {
      await coupon.updateOne(
        { _id: couponId, "usageCount.userId": userId },
        { $set: { "usageCount.$.used": true } }
      );
    }
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      title: "Order Success",
      text: "Product ordered successfully",
      icon: "success"
    });

  } catch (error) {
    console.log("catch block is working")
    await session.abortTransaction();
    session.endSession();
    console.error(error.message);

    if (error.message === "OUT_OF_STOCK") {
      return res.status(400).json({
        title: "Order Failed",
        text: "One or more products are out of stock",
        icon: "error"
      });
    }

    if (error.message === "CART_EMPTY") {
      return res.status(400).json({
        title: "Error",
        text: "Your cart is empty",
        icon: "error"
      });
    }

    if (error.message === "INVALID_CART_ITEMS") {
      req.flash(
        "error",
        "Some items were removed because they are no longer available"
      );
      return res.redirect("/cart");
    }

    if (error.message === "ADDRESS_NOT_FOUND") {
      return res.status(400).json({
        title: "Error",
        text: "Shipping address not found",
        icon: "error"
      });
    }



    next(error);
  }
};


const productDetailsInOrder=async(req,res,next)=>{
    try { 
        
     const productOrderId =req.query.id
      const userId = req.session.user_id;
     const order = await Order.findOne({userId,"OrderedProducts._id": productOrderId}).populate('OrderedProducts.productId');
     if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
     const orderedProduct = order.OrderedProducts.id(productOrderId);  
      res.json({
      result: [
        {
          ...orderedProduct.toObject(),
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus
        }
      ]
    });
      
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