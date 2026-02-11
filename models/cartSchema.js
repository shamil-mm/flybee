const mongoose=require('mongoose')
const cartSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user_data'},
    items:[
            {
            productId:{type:mongoose.Schema.Types.ObjectId,ref:'product'},
            variantId:{type:mongoose.Schema.Types.ObjectId},
            quantity:{type:Number,default:1},
            }
         ]
},{ timestamps: true })
const cart=mongoose.model('cart',cartSchema)
module.exports=cart