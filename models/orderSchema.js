const mongoose=require('mongoose')
 const orderSchema=new mongoose.Schema({
     userId:{type:mongoose.Schema.Types.ObjectId,ref:'user_data'},
     OrderedProducts:[{
               productId:{type:mongoose.Schema.Types.ObjectId,ref:'product'},
               quantity:{type:Number,default:1},
               shippingAddress:{
                                 name:{type:String, required: true},
                              address:{type:String, required: true},
                              email:{type:String, required: true},
                              country:{type:String, required: true},
                              city:{type:String, required: true},
                              state:{type:String, required: true},
                              pincode:{type:String, required: true},
                              phone:{type:String, required: true}
                           },
                  orderDate:{type:Date,default:Date.now},
                  paymentMethod:{type:String,default:'cash on delivery',enum:['cash on delivery','Rasorpay']},
                  orderStatus:{type:String,default:"Placed",enum:["Placed","Pending","Processing","Canceled","Delivered","Return","Shipping"]},
                  paymentStatus:{type:String,default:"Not paid",enum:["Not paid","Paid","Failed"]},
                  returnRequest:{type:Boolean,default:false}, 
                  cancellationReason:{type:String,default:'none'}
                  
         
               

     }],
     TotalAmount:{type:Number,required:true},
     couponPercentage:{type:Number,default:0}
     
      
      
   })

      
    const Order=mongoose.model('Order',orderSchema)
    module.exports=Order