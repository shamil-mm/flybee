const user_data=require('../../models/user_model')
const Address=require('../../models/userAddress')
const Order=require('../../models/orderSchema')
const personalInfo=async(req,res)=>{
    try {

       let user=req.session.user_id
       if (user){
           const data=await user_data.userRegister.findById({_id:user})
           const datas=await Address.findOne({userId:req.session.user_id})
           if(datas&& datas.addresses!==null){
            const order=await Order.findOne({userId:req.session.user_id}).populate('OrderedProducts.productId')
            
         
            if(order){
            
                res.render('userinfo' ,{data:data,datas:datas,addressFound:true,orderfound:true,order:order,edit:req.flash('edit'),form:req.flash('form'),pass:req.flash('pass')})
            }else{
                res.render('userinfo' ,{data:data,datas:datas,addressFound:true,orderfound:false,edit:req.flash('edit'),form:req.flash('form'),pass:req.flash('pass')})
          
            }
           }else{
            let text='No user adderss fount'
            res.render('userinfo', { data: data, datas: datas, addressFound:false,orderfound:false, message: text, edit: req.flash('edit'),form:req.flash('form'),pass:req.flash('pass')
        });
           }
        }else{
            res.redirect('/homePage')
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports=personalInfo