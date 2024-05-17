const mongoose=require('mongoose')
const addPro=new mongoose.Schema({
    product_name:{type:String,required:true},
    size:{type:String},
    brand:{type:String},
    Description:{type:String},
    image:{type:Array},
    price:{type:Number},
    stock:{type:Number},
    category:{type:mongoose.Schema.Types.ObjectId ,ref:'cate_schema'},
    is_list:{type:Boolean,default:false},
    is_delete:{type:Boolean,default:false},
    
},{timestamps:true})
const add_pro_model=mongoose.model('product',addPro)
module.exports={add_pro_model}