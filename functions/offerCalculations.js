const Offer = require('../models/offerSchema');

const getActiveProductOffers = async function(productId) {
    const currentDate = new Date();
    const productOffers = await Offer.find({
        productId: productId,
        startingDate: { $lte: currentDate },
        expiryDate: { $gte: currentDate }
    }).exec();
    return productOffers;
};

const getActiveCategoryOffers = async function(categoryId) {
    const currentDate = new Date();
    const categoryOffers = await Offer.find({
        categoryId: categoryId,
        startingDate: { $lte: currentDate },
        expiryDate: { $gte: currentDate }
    }).exec();
    return categoryOffers;
};

module.exports = { getActiveProductOffers,getActiveCategoryOffers };
