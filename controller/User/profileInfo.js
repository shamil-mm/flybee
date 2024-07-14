const userSchema=require('../../models/userSchema')
const Address=require('../../models/addressSchema')
const Order=require('../../models/orderSchema')
const coupon=require('../../models/couponSchema')
const wallet=require('../../models/walletSchema')
const bcrypt=require('bcrypt')



const personalInfo=async(req,res,next)=>{
    try {
       let user=req.session.user_id
       if (user){

           const data=await userSchema.userRegister.findById({_id:user})
           const datas=await Address.findOne({userId:req.session.user_id})
           const couponFount=await coupon.find({status:true})
           const currentDate=new Date()
           const couponfount=couponFount.filter((value)=>{
                   return value.expirationDate>=currentDate
             })

       
             const page = parseInt(req.query.page) || 1;
             const limit = parseInt(req.query.limit) || 4; 
             const skip = (page - 1) * limit;

             const Wallet = await wallet.findOne({ userId: req.session.user_id }).populate('userId');

           const totalPages = Math.ceil(Wallet.transferHistory.length/limit)
           const transactions =Wallet.transferHistory.reverse().slice(skip, skip + limit);
          const fullData={transactions,totalPages,page,totalAmount:Wallet.userBalance}
          
           if(datas&& datas.addresses!==null){
            const order=await Order.find({userId:req.session.user_id}).populate('OrderedProducts.productId').populate({path: 'OrderedProducts.productId',populate: { path: 'category' }});

            if(order){
                res.render('userinfo' ,{data:data,datas:datas,addressFound:true,orderfound:true,order:order,edit:req.flash('edit'),form:req.flash('form'),pass:req.flash('pass'),coupon:couponfount,fullData})
            }else{
                res.render('userinfo' ,{data:data,datas:datas,addressFound:true,orderfound:false,edit:req.flash('edit'),form:req.flash('form'),pass:req.flash('pass'),coupon:couponfount,Wallet,fullData})
            }
           }else{
            let text='No user adderss fount'
            res.render('userinfo', { data: data, datas: datas, addressFound:false,orderfound:false, message: text, edit: req.flash('edit'),form:req.flash('form'),pass:req.flash('pass'),coupon:couponfount,Wallet,fullData});
           }
        }else{
            res.redirect('/#signin-modal')
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const editUserPresonalInfo=async(req,res,next)=>{
    try {
        let user=req.session.user_id
        if(user){
            const {name,email,phone}=req.body
           const findData= await userSchema.userRegister.find({})
          const filterData= findData.filter((value)=>{
            return value.User_name==name ||value.User_email==email
           })
           if(filterData.length==0){
               const data=await userSchema.userRegister.findByIdAndUpdate({_id:user},{$set:{User_name:name,User_email:email,User_number:phone}})
               res.redirect('/personalInfo')
           }else{
            req.flash('form','This user name already existed use another one!!!')
            res.redirect('/personalInfo')
           } 
        }else{
            res.redirect('/')
        }
        
    } catch (error) {
        next(error)
    }
}

const changeUserPassword=async(req,res,next)=>{
    try {
        let user=req.session.user_id
        if(user){
            const {password,re_password}=req.body
      if(password==re_password){
        const b_pass=await bcrypt.hash(password,10)
        const data=await userSchema.userRegister.findByIdAndUpdate({_id:user},{$set:{User_password:b_pass}})
        req.flash("pass","password changed")
        res.redirect('/personalInfo')

        }

        }else{
            res.redirect('/')
        }
      
    } catch (error) {
        next(error)
    }
}
const AddnewAddressRender=async(req,res,next)=>{
    try {
        res.render('editaddress')
    } catch (error) {
        next(error)
    }
}

const EditAddressPageRender=async(req,res,next)=>{
    try {
        const data=await Address.findOne({userId:req.session.user_id})
        if(!data ||!data.addresses || data.addresses.length===0){
            res.render('AddressEdit',{data:[]})  
        }else{
            const single =data.addresses.filter((value)=>{
            return  value._id==req.query.id
            })
            res.render('AddressEdit',{data:single})
        }
    } catch (error) {
        next(error)
    }
}



const AddorUpdateAddress=async(req,res,next)=>{
    try {
       const {name,country,address,city,state,pincode,phone,email}=req.body
       if(req.session.user_id){
       const user=await Address.findOne({userId:req.session.user_id})
       if(!user){
       const user_address=new Address({
        userId:req.session.user_id,
        addresses:{
            name:name,
            address:address,
            email:email,
            country:country,
            city:city,
            state:state,
            pincode:pincode,
            phone:phone
        }
    })
    await user_address.save()
    
}
    else if(user){
       await Address.findOneAndUpdate({userId:req.session.user_id},{$push:{addresses:
        [{
            name:name,
            address:address,
            email:email,
            country:country,
            city:city,
            state:state,
            pincode:pincode,
            phone:phone

        }]
    }})  
    }
    
  
   
   res.redirect('/personalInfo')
}else{

res.redirect('/')
}

    } catch (error) {
        next(error);
    }
} 



module.exports={personalInfo,editUserPresonalInfo,changeUserPassword,AddnewAddressRender,EditAddressPageRender,AddorUpdateAddress}