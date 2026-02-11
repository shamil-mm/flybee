const mongoose=require('mongoose')

const orderedProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true
  },

  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  productName: {
    type: String,
    required: true
  },

  brand: String,

  size: String,
  color: String,

  price: {
    type: Number,
    required: true
  },

  image: {
    type: String
  },

  quantity: {
    type: Number,
    required: true
  },

  orderStatus: {
    type: String,
    enum: ["Placed","Pending","Processing","Canceled","Delivered","Return","Shipping"],
    default: "Placed"
  },

  returnRequest: {
    type: Boolean,
    default: false
  },

  cancellationReason: {
    type: String,
    default: "none"
  },
  offerPercentage:{
   type:Number,
   default:0
  },
  category:{
   type:Object
  }
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_data",
      required: true
    },

    OrderedProducts: [orderedProductSchema],

    shippingAddress: {
      name: String,
      address: String,
      email: String,
      country: String,
      city: String,
      state: String,
      pincode: String,
      phone: String
    },

    paymentMethod: {
      type: String,
      enum: ['cash on delivery','Rasorpay','Wallet'],
      default: "cash on delivery"
    },

    paymentStatus: {
      type: String,
      enum: ["Not paid","Paid","Failed"],
      default: "Not paid"
    },
    TotalAmount: {
      type: Number,
      required: true
    },

    couponPercentage: {
      type: Number,
      default: 0
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);
      

const Order=mongoose.model('Order',orderSchema)
module.exports=Order