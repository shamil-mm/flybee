const Wishlist=require('../../models/wishlistSchema')
const wishlistRender=async(req,res)=>{
    try {
        if(req.session.user_id){
        const wishlistData=await Wishlist.findOne({userId: req.session.user_id}).populate('wishlist.items')
       
        if(wishlistData){
            res.render('wishlist',{wishListData:wishlistData.wishlist,wishlist:true})
        }else{
            res.render('wishlist',{wishlist:false})
        }
        
        
        }else{
            res.redirect('/homePage')
        }
    } catch (error) {
        console.log(error)
    }
}
const addWishlist=async(req,res)=>{
    try {
        if(req.session.user_id){
        const productId=req.query.id
        let userWishlist = await Wishlist.findOne({ userId: req.session.user_id })
    
        if (userWishlist) {
            await Wishlist.updateOne(
                { userId: req.session.user_id},
                { $push:{ wishlist:{items:productId }} }
            )
            
        } else {
            
            userWishlist = new Wishlist({
                userId: req.session.user_id,
                wishlist: [{items:productId}]
            })
        }
    
        
        await userWishlist.save();
      res.redirect('/wishlist')
        }else{
            res.redirect('/homePage')
        }  
    } catch (error) {
        console.log(error)
    }
}

const removeWishList=async(req,res)=>{
    try {
       const wishlistId= req.query.id
       await Wishlist.updateOne({ userId: req.session.user_id},{ $pull:{ wishlist:{_id:wishlistId }} })
       
        
        
    } catch (error) {
        console.log(error)
    }
}
module.exports={wishlistRender,addWishlist,removeWishList}