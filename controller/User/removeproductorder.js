const Order = require('../../models/orderSchema');
const {Product} = require('../../models/productSchema');
const Offer = require('../../models/offerSchema');
const wallet = require('../../models/walletSchema');

const removeproductorder = async (req,res,next) => {
    try {
        const { id: orderedProductId } = req.query;
        const userId = req.session.user_id;

        const order  = await Order.findOne({ userId ,"OrderedProducts._id": orderedProductId});
         if (!order) {
        return res.redirect('/orders');
        }
        const orderedProduct = order.OrderedProducts.id(orderedProductId);

        if (!orderedProduct || orderedProduct.orderStatus === 'Canceled') {
        return res.redirect('/orders');
        }
        const product = await Product.findById(orderedProduct.productId);
        if (!product) throw new Error('Product not found');

        const variant = product.variants.id(orderedProduct.variantId);
        if (!variant) throw new Error('Variant not found');
        variant.stock += orderedProduct.quantity;
        const basePrice = orderedProduct.price; // already stored
        const offerPercentage = orderedProduct.offerPercentage || 0;
        let discountedPrice = basePrice - (basePrice * offerPercentage) / 100;
        let productTotal = discountedPrice * orderedProduct.quantity

        let refundAmount = productTotal;

        if (order.couponPercentage && order.couponPercentage > 0) {refundAmount -= (productTotal * order.couponPercentage) / 100;}

        order.TotalAmount -= refundAmount;
        if (order.TotalAmount < 0) order.TotalAmount = 0;
        orderedProduct.orderStatus = 'Canceled';

        if (
        order.paymentMethod !== 'cash on delivery' &&
        order.paymentStatus === 'Paid'
        ) {
        const userWallet = await wallet.findOne({ userId });

        if (userWallet) {
            userWallet.userBalance += refundAmount;
            userWallet.transferHistory.push({
            type: 'CREDIT',
            amount: refundAmount,
            description: 'Order item cancelled refund'
            });
            await userWallet.save();
        }
        }

        await product.save();
        await order.save();

        res.redirect('/orders');
    } catch (error) {
        next(error);
    }
};


const returnProduct = async (req,res,next) => {
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
        next(error);
    }
};

module.exports = { removeproductorder, returnProduct };
