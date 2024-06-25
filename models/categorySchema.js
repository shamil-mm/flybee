const mongoose=require('mongoose')
const category_schema=new mongoose.Schema({
    name:{type:String},
    description:{type:String},
    is_list:{type:Boolean,default:false},
    is_delete:{type:Boolean,default:false},
    createdAat:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now}
})

const category_schema_model=mongoose.model("cate_schema",category_schema)
module.exports={category_schema_model}