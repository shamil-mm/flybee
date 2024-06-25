const Order = require('../../models/orderSchema');
const productSchema = require('../../models/productSchema');
const Offer = require('../../models/offerSchema');
const wallet = require('../../models/walletSchema');

const removeproductorder = async (req, res) => {
    try {
        const productId = req.query.id;
        const userOrders = await Order.find({ userId: req.session.user_id }).populate('OrderedProducts.productId');

        for (const order of userOrders) {
            let couponPercentage=order.couponPercentage
            const product = order.OrderedProducts.find(product => product._id.toString() === productId);

            if (product) {
                const prochange = await productSchema.add_pro_model.findOne({ _id: product.productId._id });
                prochange.stock += product.quantity;

                const productOfferApplied = await Offer.findOne({ productId: prochange._id }).populate('productId');
                const categoryOfferApplied = await Offer.findOne({ categoryId: prochange.category }).populate('categoryId');

                let productPrice;
                

                if (!productOfferApplied && !categoryOfferApplied) {
                    productPrice = prochange.price * product.quantity;
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
                product.orderStatus = 'Canceled';
                await order.save();

                const Fproduct = order.OrderedProducts.find(product => product._id.toString() === productId);

                if (Fproduct.paymentMethod === 'Rasorpay') {
                    const userWalletfount = await wallet.findOne({ userId: req.session.user_id });
                    if(couponPercentage>0){
                        userWalletfount.userBalance+=lastPrice
                        userWalletfount.transferHistory.push({
                         type:'CREDIT',
                         amount:lastPrice,
                         description:"Order Cancel"
                         
                     })


                    }else{
                        userWalletfount.userBalance+=productPrice
                        userWalletfount.transferHistory.push({
                         type:'CREDIT',
                         amount:productPrice,
                         description:"Order Cancel"
                         
                     })
                    }
                   
                await userWalletfount.save()
                } 
            }
        }
    } catch (error) {
        console.log(error);
    }
};

const returnProduct = async (req, res) => {
    try {
        const productId = req.query.id;
        const userOrders = await Order.find({ userId: req.session.user_id }).populate('OrderedProducts.productId');
        for (const order of userOrders) {
            const product = order.OrderedProducts.find(product => product._id.toString() === productId);

            if (product) {
                product.returnRequest = true;
                await order.save();
            }
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = { removeproductorder, returnProduct };
