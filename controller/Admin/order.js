const Order=require('../../models/orderSchema')
const productSchema=require('../../models/productSchema')
const Offer=require('../../models/offerSchema')
const wallet=require('../../models/walletSchema')
const paginate=require('../../functions/pagination')

const orderRenderPage=async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit =10 ;
        const startIndex = (page - 1) * limit;


let totalDocuments = 0;
const orders = await Order.find({})
orders.forEach(order => {
    totalDocuments += order.OrderedProducts.length;
});




const totalPages = Math.ceil(totalDocuments / limit);


let cumulativeProducts = 0;
let startOrderIndex = 0;
for (let i = 0; i < orders.length; i++) {
    cumulativeProducts += orders[i].OrderedProducts.length;
    if (cumulativeProducts > startIndex) {
        startOrderIndex = i;
        break;
    }
}


let ordersToFetch = [];
let fetchedProductsCount = 0;

for (let i = startOrderIndex; i < orders.length; i++) {
    ordersToFetch.push(orders[i]);
    fetchedProductsCount += orders[i].OrderedProducts.length;
    if (fetchedProductsCount >= limit + (cumulativeProducts - orders[i].OrderedProducts.length - startIndex)) {
        break;
    }
}


const orderIds = ordersToFetch.map(order => order._id);

let paginatedOrders = await Order.find({ _id: { $in: orderIds } }).populate('OrderedProducts.productId');


let productCount = cumulativeProducts - orders[startOrderIndex].OrderedProducts.length;
const finalOrders = [];
let remainingLimit = limit;

for (let order of paginatedOrders) {
    const products = order.OrderedProducts;
  
    let start = 0;

    if (productCount < startIndex) {
        start = startIndex - productCount;
    }

    const end = Math.min(start + remainingLimit, products.length);

    // Reverse the order of products within the array
    order.OrderedProducts = products.slice(start, end).reverse()
    finalOrders.push(order);
    remainingLimit -= (end - start);

    if (remainingLimit <= 0) {
        break;
    }

    productCount += products.length;
}




const FullData = { results: finalOrders, totalPages, currentPage: page };

res.render('adminOrders', { all: FullData, view: req.flash("view") });



        // const page = parseInt(req.query.page) || 1;
        // const limit =3;
        // const startIndex = (page - 1) * limit;
        // let totalDocuments=0
        // const fullOrders = await Order.find({})
        // fullOrders.forEach((value)=>{
        //     totalDocuments+=value.OrderedProducts.length
        // })
        // console.log(totalDocuments)

        
        // const results = await Order.find({}).limit(limit).skip(startIndex).populate('OrderedProducts.productId')
       
        // const totalPages=Math.ceil(totalDocuments / limit)

        // const FullData={results,totalPages,currentPage:page}

        // res.render('adminOrders',{all:FullData,view:req.flash("view")})
        
    } catch (error) {
        console.log(error)
    }
}
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
        const orderedProduct= value.OrderedProducts.find(product => product._id.equals(special_id));
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
        await order.save();
            if(currentSelection==='Canceled'){
                
                orderedProduct.productId.stock+=orderedProduct.quantity
               const x= await productSchema.add_pro_model.findOneAndUpdate({_id:orderedProduct.productId},{$set:{stock:orderedProduct.productId.stock}},{new:true})
              
               
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
        
        let updated = false;
        
        for (const order of orders) {
            let couponPercentage=order.couponPercentage
            let userId=order.userId
            const foundProduct = order.OrderedProducts.find(product => product._id == id);
            if (foundProduct) {
                // foundProduct.orderStatus = 'Return'; 
                // await order.save(); 
                // updated = true;
                // ...............................................................................
                const prochange = await productSchema.add_pro_model.findOne({ _id: foundProduct.productId._id });

                prochange.stock += foundProduct.quantity;
                const productOfferApplied = await Offer.findOne({ productId: prochange._id }).populate('productId');
                const categoryOfferApplied = await Offer.findOne({ categoryId: prochange.category }).populate('categoryId');

                let productPrice;

                if (!productOfferApplied && !categoryOfferApplied) {
                    productPrice = prochange.price * foundProduct.quantity;
                    order.TotalAmount -= productPrice;
                } else if (productOfferApplied && categoryOfferApplied) {
                    if (productOfferApplied.offerPrecentage > categoryOfferApplied.offerPrecentage) {
                        productPrice = productOfferApplied.productId.price - (productOfferApplied.productId.price * productOfferApplied.offerPrecentage / 100);
                    } else {
                        productPrice = prochange.price - (prochange.price * categoryOfferApplied.offerPrecentage / 100);
                    }
                } else if (productOfferApplied) {
                    productPrice = productOfferApplied.productId.price - (productOfferApplied.productId.price * productOfferApplied.offerPrecentage / 100);
                } else if (categoryOfferApplied) {
                    productPrice = prochange.price - (prochange.price * categoryOfferApplied.offerPrecentage / 100);
                }
                let lastPrice=0
                if(couponPercentage>0){
                    lastPrice= productPrice-productPrice*(couponPercentage/100)
                    
                 if (productPrice !== undefined) {
                     order.TotalAmount = lastPrice;
                 }
                    
                 }else{
                    order.TotalAmount = productPrice;
                }

                await prochange.save();
                foundProduct.orderStatus = 'Return';
                await order.save();

                const Fproduct = order.OrderedProducts.find(product => product._id.toString() === id);

                if (Fproduct.paymentMethod === 'Rasorpay') {
                    const userWalletfount = await wallet.findOne({ userId:userId });
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
                console.log('everythiing okkey')
            }
        }
        res.json('Return')
      
        
    } catch (error) {
        console.log(error)
    }
}


  module.exports={orderProductModalView,orderRenderPage,viewOrderDetailsRender,changeOrderStatus,orderReturnApprove}