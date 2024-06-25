const mongoose=require('mongoose')
const couponSchema=new mongoose.Schema({
    name:{type:String,required:true},
    code:{type:String,required:true,unique:true},
    minAmount:{type:Number,required:true},
    maxAmount:{type:Number,required:true},
    discountAmount:{type:Number,required:true},
    expirationDate:{type:Date,required:true},
    status:{type:Boolean,default:true},
    usageLimit:{type:Number,default:1},
    usageCount:[{
                    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user_data'},
                    used:{type:Boolean,default:false}
                }]
},{timestamps:true});
const coupon=mongoose.model('Coupon',couponSchema)
module.exports=coupon
 