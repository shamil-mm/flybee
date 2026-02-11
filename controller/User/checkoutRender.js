const Address=require('../../models/addressSchema')
const Cart=require('../../models/cartSchema')
const coupon=require('../../models/couponSchema')


const checkoutRender = async (req, res, next) => {
  try {
    const userId = req.session.user_id;
    if (!userId) return res.redirect('/');

    let totalPrice = 0;

    const addresses = await Address.findOne({ userId });
    const couponStatus = await coupon.findOne({
      usageCount: { $elemMatch: { userId, used: false } }
    });



    const cart = await Cart.findOne({ userId }).populate('items.productId');

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
      req.flash(
        'error',
        'Some items were removed because they are no longer available'
      );
      return res.redirect('/cart');
    }






    if (!cart || cart.items.length === 0) {
      return res.render('checkout', {
        datas: addresses,
        addressFound: !!addresses,
        product: [],
        total: 0,
        edit: req.flash('edit'),
        order: req.flash('order'),
        Cmsg: req.flash('Cmsg'),
        Csmsg: req.flash('Csmsg'),
        couponStatus
      });
    }
    const outOfStockItem = cart.items.find(item => {
    const product = item.productId;
    if (!product) return true;

    const variant = product.variants.id(item.variantId);
    if (!variant) return true;

    return variant.stock < item.quantity;
    });


  
    if (outOfStockItem) {
      const product = outOfStockItem.productId;
      const variant = product?.variants?.id(outOfStockItem.variantId);

      req.flash(
        'error',
        `${product.product_name} (${variant?.size || ''} ${variant?.color || ''}) is out of stock`
      );

      return res.redirect('/cart');
    }





    const checkoutItems = cart.items
      .map(item => {
        const product = item.productId;
        if (!product) return null;

        const variant = product.variants.id(item.variantId);
        if (!variant || variant.stock < item.quantity) return null;

        const basePrice = variant.price;

        const productOfferPrice = product.offerPercentage
          ? basePrice - (basePrice * product.offerPercentage) / 100
          : basePrice;

        const categoryOfferPrice = product.category?.offerPercentage
          ? basePrice - (basePrice * product.category.offerPercentage) / 100
          : basePrice;

        const finalPrice = Math.min(
          basePrice,
          productOfferPrice,
          categoryOfferPrice
        );

        const itemTotal = finalPrice * item.quantity;
        totalPrice += itemTotal;

        return {
          productId: product._id,
          productName: product.product_name,
          offerPercentage:product.offerPercentage,
          quantity: item.quantity,

          variantId: variant._id,
          size: variant.size,
          color: variant.color,
          image: variant.images?.[0],

          price: Math.round(finalPrice),
          originalPrice: basePrice,
          itemTotal: Math.round(itemTotal)
        };
      })
      .filter(Boolean);
    if (checkoutItems.length === 0) {
      return res.render('checkout', {
        datas: addresses,
        addressFound: !!addresses,
        product: [],
        total: 0,
        edit: req.flash('edit'),
        order: req.flash('order'),
        Cmsg: req.flash('Cmsg'),
        Csmsg: req.flash('Csmsg'),
        couponStatus
      });
    }

    res.render('checkout', {
      datas: addresses,
      addressFound: !!addresses,
      product: checkoutItems,
      total: Math.round(totalPrice),
      edit: req.flash('edit'),
      order: req.flash('order'),
      Cmsg: req.flash('Cmsg'),
      Csmsg: req.flash('Csmsg'),
      couponStatus
    });

  } catch (error) {
    next(error);
  }
};

module.exports=checkoutRender