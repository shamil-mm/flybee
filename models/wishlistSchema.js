const { default: mongoose } = require("mongoose");

const wishlistSchema= new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user_data'},
    wishlist:[{
       items: {type:mongoose.Schema.Types.ObjectId,ref:'product'}
    }
    ]
})
const Wishlist=mongoose.model('wishlist',wishlistSchema)
module.exports=Wishlist