const mongoose=require('mongoose')

const user_register_data=new mongoose.Schema({
User_name:{type:String},
User_email:{type:String},
User_password:{type: String},
User_number:{type:String},
referalCode:{type:String},
createdate:{type:Date ,default:Date.now},
updated:{type:Date ,default:Date.now},
is_admin:{type:Boolean,default:false},
Is_block:{type:Boolean,default:false},

})
const userRegister=mongoose.model('user_data',user_register_data)
module.exports={userRegister}