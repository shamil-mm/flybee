const mongoose=require('mongoose')

const variantSchema=new mongoose.Schema({
    size:{
        type:String,
        required:true
    },
    color:{
        type:String
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    images:{
        type:[String]
    },
    is_active:{
        type:Boolean,
        default:true
    }
},{
    _id:true
});



const productSchema=new mongoose.Schema({
    product_name:{type:String,required:true},
    brand:{type:String},
    description:{type:String},
    category:{type:mongoose.Schema.Types.ObjectId ,ref:'category',required:true},
    variants:{type:[variantSchema],required:true},
    offerPercentage:{type:Number,default:0},
    is_list:{type:Boolean,default:false},
    is_delete:{type:Boolean,default:false},   
},{timestamps:true})
const Product=mongoose.model('product',productSchema)
module.exports={Product}