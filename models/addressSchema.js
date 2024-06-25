const mongoose=require('mongoose')
const Address=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user_data'},
    addresses:[{
        name:{type:String},
    address:{type:String},
    email:{type:String},
    country:{type:String},
    city:{type:String},
    state:{type:String},
    pincode:{type:String},
    phone:{type:String}
    }]
    

})
const userAddress=mongoose.model('Address',Address)
module.exports=userAddress;