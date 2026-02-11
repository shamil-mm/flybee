const mongoose=require('mongoose')
const offerSchema= new mongoose.Schema({
   name:{type:String,required:true},
   productId:{type:mongoose.Schema.Types.ObjectId,ref:'product'},
   categoryId:{type:mongoose.Schema.Types.ObjectId,ref:'category'},
   offerPrecentage:{type:Number,required:true},
   startingDate:{type:Date,required:true},
   expiryDate:{type:Date,required:true},
   isList:{type:Boolean,default:false}
})

const offerSchemaModal=mongoose.model('offer',offerSchema)
module.exports=offerSchemaModal