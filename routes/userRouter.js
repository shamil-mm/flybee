const google_pass=require('../passports')
const express=require('express')
const userRouter=express();
userRouter.set('view engine','ejs')
const userAuth=require('../middleware/userAuth')
userRouter.set('views','views/users')
userRouter.use(express.static('public/users'))


// controllers
const user=require('../controller/User/user')
const logOut=require('../controller/User/logOut')
const product=require('../controller/User/product')
const profileInfo=require('../controller/User/profileInfo')
const cart=require('../controller/User/cart')
const removeproductorder=require('../controller/User/removeproductorder')
const couponController=require('../controller/User/couponVerifiction')
const wishlist=require('../controller/User/wishlist')
const checkoutRender=require('../controller/User/checkoutRender')
const order=require('../controller/User/order')
const invoice=require('../controller/User/invoice')
const wallet=require('../controller/User/wallet')

const sortProduct=require('../controller/User/sortProduct')
const filteredProduct=require('../controller/User/filteredProduct');
const Razorpay = require('razorpay')
const razorpay=require('../controller/User/razorpay');
const about=require('../controller/User/about')





// homePage,login and register process
userRouter.get('/',user.homePageRender) 
userRouter.post('/loadEP',user.loadSignin)
userRouter.post('/loadRG',user.loadRegister)
userRouter.post('/loadOTP',user.loadOTP)
userRouter.get('/otp',user.otpPageRender)
userRouter.get('/resentOTP',user.loadResentOtp)
userRouter.post('/reset_password',user.resetPassword)
userRouter.post('/loadrepassword',user.loadRepassword)
userRouter.get('/auth/google',google_pass.googleAuth);
userRouter.get("/auth/google/callback",google_pass.googleCallback,google_pass.setupSession)
userRouter.get('/error',userAuth.is_login,user.error) 


// logout
userRouter.get("/logout",userAuth.is_login,logOut)


// product
userRouter.get('/product',userAuth.is_login,product.productPageRender)
userRouter.get('/men',userAuth.is_login,product.mensPageRender)
userRouter.get('/women',userAuth.is_login,product.womensPageRender)
userRouter.get('/productView',userAuth.is_login,product.productViewPage)


// profileInfo
userRouter.get('/personalInfo',userAuth.is_login,profileInfo.personalInfo)
userRouter.post('/edituser',profileInfo.editUserPresonalInfo)
userRouter.post('/userPassword',profileInfo.changeUserPassword)
userRouter.get('/EditAddress',userAuth.is_login,profileInfo.AddnewAddressRender)
userRouter.post('/addorupdateaddress',profileInfo.AddorUpdateAddress)
userRouter.get('/editAddressrender',userAuth.is_login,profileInfo.EditAddressPageRender)


// cart
userRouter.get('/cart/add',userAuth.is_login,cart.addToCart)
userRouter.get('/cart',userAuth.is_login,cart.cartRender)
userRouter.post('/cartdynamic',cart.cartQuantityDynamic)
userRouter.post('/removeCartProduct',cart.removeCartProduct)


// checkout
userRouter.get('/checkout',userAuth.is_login,checkoutRender)


// order
userRouter.post('/order',order.orderCreation)
userRouter.post('/removeproductorder',removeproductorder.removeproductorder)
userRouter.post('/returnProduct',removeproductorder.returnProduct)
userRouter.post('/productDetailsInOrder',order.productDetailsInOrder)
userRouter.post('/updateaddress',order.orderTimeUpdateAddress)
userRouter.delete('/deleteAddress',userAuth.is_login,order.orderTimeDeleteAddress)
userRouter.post('/reasonSubmit',order.reasonSubmit)
userRouter.post('/failedPayNow',order.failedPayNow)
userRouter.post('/failedPaymentRetry',order.failedPaymentRetry)

// invoice

userRouter.get('/invoiceRender',userAuth.is_login,invoice.invoiceRender)
userRouter.get('/downloadInvoice',userAuth.is_login,invoice.downloadInvoice)




// sort filter in separate
userRouter.post('/sortProduct',sortProduct)
userRouter.post('/filteredProduct',filteredProduct)


// coupons
userRouter.post('/couponVerifiction',couponController.couponVerifiction)
userRouter.post('/removeCoupon',couponController.removeCoupon)
userRouter.post('/fetchAvaliableCoupon',couponController.fetchAvaliableCoupon)
 

// wishlist
userRouter.get('/wishlist',userAuth.is_login,wishlist.wishlistRender)
userRouter.get('/addWishlist',userAuth.is_login,wishlist.addWishlist)
userRouter.delete('/removeWishList',wishlist.removeWishList)


// razorpay
userRouter.post('/razorpay',razorpay.razorpay)
userRouter.get('/razorpayError',userAuth.is_login,razorpay.razorpayErrorPage)

//wallet
userRouter.post('/addMoneyToWallet',wallet.addMoneyToWallet)

// about 
userRouter.get('/about',userAuth.is_login,about)

userRouter.use((err, req, res, next) => {
    console.log(err)
    res.status(500).render('error', { error: err.message });
});



module.exports={userRouter}