const mongoose=require('mongoose')
const walletSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user_data'},
    userBalance:{type:Number,default:0},
    transferHistory:[{
        type:{type:String, enum: ['CREDIT', 'DEBIT']},
        amount:{type:Number},
        description:{type:String},
        timeStamp:{type:Date,default:Date.now}
    }]
})
const wallet=mongoose.model('wallet',walletSchema)
module.exports=wallet

