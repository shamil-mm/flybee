const express=require('express')
const adminRouter = express()
const adminmulter=require('../middleware/multerimg')
const Auth=require('../middleware/adminAuth')
// Set view engine
adminRouter.set('view engine', 'ejs');
adminRouter.set('views', 'views/admin');

// Controllers
const admin=require('../controller/Admin/admin')
const product=require('../controller/Admin/product')
const category=require('../controller/Admin/category')
const users=require('../controller/Admin/users')
const logOut=require('../controller/Admin/logOut')
const order=require('../controller/Admin/order')
const Coupons=require('../controller/Admin/Coupons')
const offer=require('../controller/Admin/offer')
const salesReport=require('../controller/Admin/salesReport')
const chart=require('../controller/Admin/chartData')


// landing signin and register process
adminRouter.get('/',Auth.is_logout,admin.LoginPage)
adminRouter.get('/register',Auth.is_logout,admin.registerPage)
adminRouter.get('/otp',admin.otpPageRender)
adminRouter.post('/loadOTP',admin.loadOTP)
adminRouter.get('/resentOTP',admin.resentOTP)
adminRouter.get('/home',Auth.is_login,admin.homePage) 
adminRouter.post('/loadRGform',admin.loadRegisterForm)
adminRouter.post('/loadLIform',admin.loadLoginForm)


// logOut
adminRouter.get('/logout',Auth.is_login,logOut)


// users process
adminRouter.get('/users',Auth.is_login,users.usersPageRender)
adminRouter.post('/block',users.userBlockUnblock)


// products process
adminRouter.get('/products',Auth.is_login,product.productPageRender)
adminRouter.post('/List_product',product.productListUnlistLoader)
adminRouter.get('/Edit_product',Auth.is_login,product.editProductPageRender)
adminRouter.post('/editproduct',adminmulter.upload.array('images'),product.editProductLoad)
adminRouter.get('/add_product',Auth.is_login,product.addProductPageRender)
adminRouter.post('/add_pro',adminmulter.upload.array('images'),product.addProductLoad)
adminRouter.get('/delete_render',Auth.is_login,product.deletedProductPageRender)
adminRouter.post('/delete_pro',product.productDelete)
adminRouter.post('/recover',product.productRecover)
adminRouter.post('/delete_p',product.deleteProductPermanently)

adminRouter.post('/upload',adminmulter.upload.single('croppedImage'),product.imageUpload)


// categorys process
adminRouter.get('/categories',Auth.is_login,category.categoryRenderPage)
adminRouter.post('/add_category',category.loadAddCategory)
adminRouter.post('/recover_cate',category.loadCategoryRecover)
adminRouter.post('/list_unlist',category.categoryListUnlistLoader)
adminRouter.get('/edit',Auth.is_login,category.editCategoryPageRender)
adminRouter.post('/edit',category.editCategoryLoader)
adminRouter.post('/category/delete',category.categoryDelete)
adminRouter.get('/delete/page',Auth.is_login,category.categoryRecoveryPageRender)
adminRouter.post('/deletepermanently/category',category.categoryDeletePermanently)


// orders process
adminRouter.get('/order',Auth.is_login,order.orderRenderPage)
adminRouter.post('/veiwproduct',order.orderProductModalView)
adminRouter.get('/details',Auth.is_login,order.viewOrderDetailsRender)
adminRouter.post('/changeStatus',order.changeOrderStatus)
adminRouter.post('/returnApprove',order.orderReturnApprove)


// coupons process
adminRouter.get('/Coupons',Coupons.Coupons)
adminRouter.post('/loadCoupon',Coupons.loadCoupon)
adminRouter.get('/couponEdit',Coupons.couponEdit)
adminRouter.post('/loadCouponEdit',Coupons.loadCouponEdit)
adminRouter.delete('/couponDelete',Coupons.couponDelete)
adminRouter.post('/couponlist_unlist',Coupons.couponlist_unlist)
 

// offers process
adminRouter.get('/offers',offer.offerRender)
adminRouter.post('/offers',offer.offerLoad)
adminRouter.post('/showProductlist',offer.showProductlist)
adminRouter.get('/editOffer',offer.editOffer)
adminRouter.post('/loadEditOffer',offer.loadEditOffer)
adminRouter.post('/offerDelete',offer.offerDelete)


// salesreports process
adminRouter.get('/salesReporst',salesReport.salesReporst)
adminRouter.post('/sortListOfOrder',salesReport.sortListOfOrder)

// chart
adminRouter.post('/salesData',chart.chartData)
adminRouter.post('/bestSellingProducts',chart.chartDataTwo)




module.exports={adminRouter}
