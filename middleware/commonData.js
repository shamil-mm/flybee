const cart=require('../models/cartSchema')
const wishlist=require('../models/wishlistSchema')

module.exports = async(req, res, next) => {
    const cartDocument=await cart.findOne({userId:req.session.user_id})
    const cartCount=cartDocument?cartDocument.items.length : 0
  
    const wishlistDocument = await wishlist.findOne({ userId: req.session.user_id });
    const wishlistCount = wishlistDocument ? wishlistDocument.wishlist.length : 0;
    res.locals.commonData = {
      user: req.session.user_id,
      cartCount:cartCount,
      wishlistCount:wishlistCount
      };
    next();
  };