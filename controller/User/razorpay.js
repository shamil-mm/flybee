const Razorpay=require('razorpay')
const {RAZORPAY_ID_KEY,RAZORPAY_SECRET_KEY}=process.env
const razorpay=async(req,res)=>{
    try {
    

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
                       product_name:"hello",
                       description:"hai",
                       contact:"1234567890",
                       name:"vaseem",
                       email:'vasi@gmail.com'
           
                   }
                   res.json(resposeObj)
               }else{
                   res.status(400).send({success:false,msg:'Something went wrong!'});
           
               }
           
              })
            }
           
    catch (error) {
      console.log(error)  
    }
}

const razorpayErrorPage=async(req,res)=>{
  try {
      const status=req.query.status
      res.render('razorpayError',{status})
  } catch (error) {
      console.log(error)
  }
}

module.exports={razorpay,razorpayErrorPage}