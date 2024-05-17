const Address=require('../../models/userAddress')
const Cart=require('../../models/cartSchema')
const checkoutRender=async(req,res)=>{
    try {
        let user=req.session.user_id
        var totalPrice=0
        if (user){
            
            const datas=await Address.findOne({userId:req.session.user_id})
            if(datas&& datas.addresses!==null){
                
            const userfind=await Cart.findOne({userId:req.session.user_id}).populate('items.productId')
            if(!userfind){
             
                res.render('checkout' ,{datas:datas,addressFound:true,edit:req.flash('edit'),product:[],total:totalPrice,order:req.flash('order')})
                return
            }
           
           const product= userfind.items.map((value)=>{
                totalPrice+=value.productId.price*value.quantity
                return value
            })
        
      
        
        
            res.render('checkout' ,{datas:datas,addressFound:true,edit:req.flash('edit'),product:product,total:totalPrice,order:req.flash('order')})
            }else{
                console.log("address not okey")
             let text='No user adderss fount'
             res.render('checkout', { datas: datas, addressFound: false, message: text,product:[],total:totalPrice, edit: req.flash('edit'),order:req.flash('order')});
            }
         }else{
             res.redirect('/homePage')
         }
       
    } catch (error) {
       console.log(error) 
    }
}
module.exports=checkoutRender