const Cart=require('../../models/cartSchema')
const cartdynamic=async(req,res)=>{
    try {

        if(req.session.user_id){
            const productId=req.query.id
            const quantity=req.query.value
            

        const data=await Cart.findOne({userId:req.session.user_id})
      const isMatch=  data.items.find((value)=>{
            return value.productId.equals(productId)
        })
     
        isMatch.quantity=quantity
        data.save()
        }else{
            console.log('user is missing one')
            res.redirect('/homePage')
        }
        
    } catch (error) {
        console.log(error)
    }
}
module.exports=cartdynamic