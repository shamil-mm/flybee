const Order=require('../../models/orderSchema')
const {Product}=require('../../models/productSchema')
const Offer=require('../../models/offerSchema')
const wallet=require('../../models/walletSchema')
const paginate=require('../../functions/pagination')

const orderRenderPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim() || "";
    let matchQuery = {};
     if (search) {
      matchQuery = {
        $or: [
          { paymentMethod: { $regex: search, $options: "i" } },
          { paymentStatus: { $regex: search, $options: "i" } },
          { "OrderedProducts.productName": { $regex: search, $options: "i" } },
          { "OrderedProducts.orderStatus": { $regex: search, $options: "i" } },
          { "shippingAddress.name": { $regex: search, $options: "i" } }
        ]
      };
    }
    
    const orders = await Order.find(matchQuery)
      .populate('OrderedProducts.productId')
      .sort({ createdAt: -1 })
      .lean();

    if (!orders.length) {
      return res.render('adminOrders', {
        all: { results: [], totalPages: 0, currentPage: page },
        search,
        view: req.flash('view')
      });
    }

    const flattened = [];

    for (const order of orders) {
      for (const product of order.OrderedProducts) {
        flattened.push({
          ...product,
          shippingAddress: order.shippingAddress,
          orderDate: order.createdAt,
          TotalAmount: order.TotalAmount,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          orderId: order._id
        });
      }
    }

    const totalProducts = flattened.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const paginatedProducts = flattened.slice(skip, skip + limit);

    const groupedOrders = {};

    for (const item of paginatedProducts) {
      if (!groupedOrders[item.orderId]) {
        groupedOrders[item.orderId] = {
          _id: item.orderId,
          TotalAmount: item.TotalAmount,
          OrderedProducts: []
        };
      }

      groupedOrders[item.orderId].OrderedProducts.push(item);
    }

    const finalOrders = Object.values(groupedOrders);

    res.render('adminOrders', {
      all: {
        results: finalOrders,
        totalPages,
        currentPage: page
      },
      search,
      view: req.flash('view')
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Server Error');
  }
};

const viewOrderDetailsRender=async(req,res)=>{
   try {
       res.render('adminOrdersdetail')
       
   } catch (error) {
       console.log(error)
   }
}

const orderProductModalView=async(req,res)=>{
    try {
       const special_id = req.query.id;
       const orderWithProduct = await Order.find({'OrderedProducts._id':special_id}).populate('OrderedProducts.productId')
       orderWithProduct.forEach((value)=>{
        const orderedProduct= value.OrderedProducts.find(product => product._id.equals(special_id))
             res.send(orderedProduct);
       })

    } catch (error) {
       console.log(error) 
    }
  }
  
const changeOrderStatus=async(req,res)=>{
    try {
   

    const { id: special_id, value: currentSelection } = req.query;
  const orders = await Order.find({'OrderedProducts._id': special_id }).populate('OrderedProducts.productId')
  
    for (const order of orders) {
   
     const orderedProduct = order.OrderedProducts.find(product => product._id.equals(special_id));
     
    if (orderedProduct) {
        
            
        orderedProduct.orderStatus=currentSelection;
        if(currentSelection==='Delivered'){
            orderedProduct.paymentStatus='Paid'; 
        }
       
        
        await order.save();
            if(currentSelection==='Canceled'){
                
                orderedProduct.productId.stock+=orderedProduct.quantity
               const x= await Product.findOneAndUpdate({_id:orderedProduct.productId},{$set:{stock:orderedProduct.productId.stock}},{new:true})
              
               
            } 
        }
    }    
    } catch (error) {
      console.log(error)  
    }
}




const orderReturnApprove=async(req,res)=>{
    try {
        const id = req.query.id;
        const orders = await Order.find({});
        
        for (const order of orders) {
          
            let couponPercentage=order.couponPercentage
            let userId=order.userId

            const orderedProduct = order.OrderedProducts.find(product =>product._id.toString() ==id );
            
            if (orderedProduct) {
                const product = await Product.findOne({ _id: orderedProduct.productId });
                if (!product) continue;

                const variant = product.variants.id(orderedProduct.variantId);
                if (!variant) continue;
                

                variant.stock += orderedProduct.quantity;
                await product.save()

                const productOfferApplied = await Offer.findOne({ productId: product._id }).populate('productId');
                const categoryOfferApplied = await Offer.findOne({ categoryId: product.category }).populate('categoryId');

                let productPrice;

                if (!productOfferApplied && !categoryOfferApplied) {
                    productPrice = variant.price * orderedProduct.quantity;
                   
                } else if (productOfferApplied && categoryOfferApplied) {
                    if (productOfferApplied.offerPrecentage > categoryOfferApplied.offerPrecentage) {
                        productPrice = variant.price - (variant.price * productOfferApplied.offerPrecentage / 100);
                    } else {
                        productPrice = variant.price - (variant.price * categoryOfferApplied.offerPrecentage / 100);
                    }
                    productPrice *= orderedProduct.quantity;
                } else if (productOfferApplied) {
                  
                    productPrice = variant.price - (variant.price * productOfferApplied.offerPrecentage / 100);
                    productPrice *= orderedProduct.quantity;
                } else if (categoryOfferApplied) {
                    productPrice = variant.price - (variant.price * categoryOfferApplied.offerPrecentage / 100);
                    productPrice *= orderedProduct.quantity;
                }
                let lastPrice=0
                if(couponPercentage>0){
                    lastPrice= productPrice-productPrice*(couponPercentage/100)
                    
                 }else{
                    lastPrice = productPrice;
                }
                if (productPrice !== undefined) {
                    order.TotalAmount -= lastPrice;
                }

                orderedProduct.orderStatus = 'Return';
                await order.save();
                if (order.paymentMethod === 'Rasorpay') {
                    const userWalletfount = await wallet.findOne({ userId });
                    if(couponPercentage>0){
                        userWalletfount.userBalance+=lastPrice
                        userWalletfount.transferHistory.push({
                         type:'CREDIT',
                         amount:lastPrice,
                         description:"Return Order"
                         
                     })


                    }else{
                        userWalletfount.userBalance+=productPrice
                        userWalletfount.transferHistory.push({
                         type:'CREDIT',
                         amount:productPrice,
                         description:"Return Order"
                         
                     })
                    }
                await userWalletfount.save()
                }
            }
        }
        res.json('Return')
      
        
    } catch (error) {
        console.log(error)
    }
}


  module.exports={orderProductModalView,orderRenderPage,viewOrderDetailsRender,changeOrderStatus,orderReturnApprove}