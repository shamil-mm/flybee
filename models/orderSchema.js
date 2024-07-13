const mongoose=require('mongoose')
 const orderSchema=new mongoose.Schema({
     userId:{type:mongoose.Schema.Types.ObjectId,ref:'user_data'},
     OrderedProducts:[{

               productId:{ 
               _id:{type:String},
               product_name:{type:String,required:true},
               size:{type:String},
               brand:{type:String},
               Description:{type:String},
               image:{type:Array},
               price:{type:Number},
               stock:{type:Number},
               category:{type:Object},
               is_list:{type:Boolean,default:false},
               is_delete:{type:Boolean,default:false},
               offerPercentage:{type:Number,default:0}
            
            },
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
                  paymentMethod:{type:String,default:'cash on delivery',enum:['cash on delivery','Rasorpay','Wallet']},
                  orderStatus:{type:String,default:"Placed",enum:["Placed","Pending","Processing","Canceled","Delivered","Return","Shipping"]},
                  paymentStatus:{type:String,default:"Not paid",enum:["Not paid","Paid","Failed"]},
                  returnRequest:{type:Boolean,default:false}, 
                  cancellationReason:{type:String,default:'none'}
                  
         
               

     }],
     TotalAmount:{type:Number,required:true},
     couponPercentage:{type:Number,default:0}
     
      
      
   }, { strictPopulate: false })

      
    const Order=mongoose.model('Order',orderSchema)
    module.exports=Order