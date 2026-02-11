const mongoose=require('mongoose')
const categorySchema=new mongoose.Schema({
    name:{type:String},
    description:{type:String},
    is_list:{type:Boolean,default:false},
    is_delete:{type:Boolean,default:false},
    createdAat:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now},
    offerPercentage:{type:Number,default:0}
})

const Category=mongoose.model("category",categorySchema)
module.exports={Category}