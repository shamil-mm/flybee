const Razorpay=require('razorpay')
require('dotenv').config()
const {RAZORPAY_ID_KEY,RAZORPAY_SECRET_KEY}=process.env
const razorpay=async(req,res,next)=>{
    try {
    
        console.log(RAZORPAY_ID_KEY,RAZORPAY_SECRET_KEY);
            const totalAmount =req.query.total
              const razorpayInstance = new Razorpay({
               key_id:RAZORPAY_ID_KEY,
               key_secret:RAZORPAY_SECRET_KEY
              })
           
              const options={
               amount:totalAmount*100,
               currency:'INR',
               receipt:'razorpayuser@gmail.com'
              }
              razorpayInstance.orders.create(options,(err,order)=>{
               if(!err){
                 const resposeObj= {
                       success:true,
                       msg:'Order Created',
                       order_id:order.id,
                       amount:totalAmount,
                       key_id:RAZORPAY_ID_KEY,
                       product_name:"FLYBEE",
                       description:"hai",
                       contact:"9865208451",
                       name:"shamil",
                       email:'shamil@gmail.com'
           
                   }
                   res.json(resposeObj)
               }else{
                console.log(err);
                   res.status(400).send({success:false,msg:'Something went wrong!'});
           
               }
           
              })
            }
           
    catch (error) {
      console.log(error);
      next(error)  
    }
}

const razorpayErrorPage=async(req,res,next)=>{
  try {
      const status=req.query.status
      res.render('razorpayError',{status})
  } catch (error) {
      next(error)
  }
}

module.exports={razorpay,razorpayErrorPage}