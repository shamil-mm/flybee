const otps=require('../../models/otpSchema')
const userSchema=require('../../models/userSchema')
const otp_email_generator=require('../../functions/otp_email_generator')
const Order=require('../../models/orderSchema')
const bcrypt=require('bcrypt')
const productSchema=require('../../models/productSchema')

const LoginPage=async(req,res)=>{
    try {
        res.render('adminLogin',{msg:req.flash('rg')})
    } catch (error) {
        console.log(error)
    }
}
const registerPage=async(req,res)=>{
    try {
        res.render('adminRegister')
    } catch (error){
        console.log(error)
    }
}
const loadLoginForm=async(req,res)=>{
    try {
      const{email12,password12}=req.body
   
    const checkEmail=await userSchema.userRegister.findOne({User_email:email12})
    if(checkEmail){
        const checkPassword=await bcrypt.compare(password12,checkEmail.User_password)
        if(checkPassword){
             if(checkEmail.Is_block==false && checkEmail.is_admin==true){
                req.session.admin_id=checkEmail._id
                // console.log(req.session.admin_id)
                req.flash('rg',"Login Successfully")
                res.redirect('/admin/home')
            }else{
                req.flash('msg',"user is blocked")
                res.redirect('/admin')
                
            }
        }else{
            
            req.flash('msg',"wrong password")
            res.redirect('/admin')
        }
}
else{
    req.flash('msg',"user not fount")
    res.redirect('/admin')
}
    } catch (error) {
        console.log(error) 
    }
}
const loadRegisterForm=async(req,res)=>{
    try {
      const{username,useremail,userpassword}=req.body
      let alreadyexist=await userSchema.userRegister.findOne({User_email:useremail})
      if(alreadyexist){
        console.log("already existed");
        res.redirect('/admin/register')
        return
      }else{
        let hash_password = await bcrypt.hash(userpassword,10)
        let userData={
            User_name:username,
            User_email:useremail,
            User_password:hash_password,
            is_admin:true
          }
        req.session.theuser=userData
       
        if(req.session.theuser){
            let otp=otp_email_generator(useremail)
            console.log(otp);
            const newOTP=new otps({email:useremail,otp})
                  const OTP=  await newOTP.save();
                  req.flash('otp',OTP)
               
        }
        res.redirect('/admin/otp')
      }
    } catch (error) {
        console.log(error)
    }
}

const homePage=async(req,res)=>{
    try {
        const topCategories = await Order.aggregate([
            {
                $match: {
                    'OrderedProducts.orderStatus': "Delivered"
                }
            },
            {
                $unwind: '$OrderedProducts'
            },
            {
                $group: {
                    _id: '$OrderedProducts.productId',
                    totalOrdered: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'products',  
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $unwind: '$productDetails'
            },
            {
                $lookup: {
                    from: 'cate_schemas',  
                    localField: 'productDetails.category',
                    foreignField: '_id',
                    as: 'categoryDetails'
                }
            },
            {
                $unwind: '$categoryDetails'
            },
            {
                $group: {
                    _id: '$categoryDetails._id',
                    name: { $first: '$categoryDetails.name' },
                    description: { $first: '$categoryDetails.description' },
                    totalOrdered: { $sum: '$totalOrdered' }
                }
            },
            {
                $sort: { totalOrdered: -1 }
            },
            {
                $limit: 5 
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    description: 1,
                    totalOrdered: 1
                }
            }
        ]);
        

        const result = await Order.aggregate([
            {
              $match: {
                'OrderedProducts.orderStatus': "Delivered",
                'OrderedProducts.paymentStatus': "Paid"
              }
            },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$TotalAmount" }
              }
            }
          ]);
          const orderCount = await Order.aggregate([
            {
              $match: {
                'OrderedProducts.orderStatus': "Delivered",
                'OrderedProducts.paymentStatus': "Paid"
              }
            },
            {
              $count: "totalCount"
            }
          ]);

          const countoftotalproduct=await productSchema.add_pro_model.find({is_list:false,is_delete:false}).countDocuments()    
          
   
  
          const totalRevenue = (result[0] && result[0].totalRevenue) || 0;
          const totalorderCount = (orderCount[0] && orderCount[0].totalCount) || 0;
        res.render('index', {
            rg: req.flash('rg'),categoryDetails:topCategories,totalRevenue,totalorderCount,countoftotalproduct
        });
    
    } catch (error) {
        console.log("Error fetching data:", error);
    }
    
    
}
const otpPageRender=async(req,res)=>{
    try {
        res.render('adminOtp',{otp:req.flash('otp'),otpstatus:req.flash('otpstatus')})
    } catch (error) {
        console.log(error)
    }
}

const loadOTP=async(req,res)=>{
    
    try {
        const a={input1,input2,input3,input4}=req.body
        let inputOTP=Object.values(a).join('')
                    
        
        if(req.session.theuser){
        const otp=await otps.findOne({email:req.session.theuser.User_email}) 
       if(otp){
        if(otp.otp == inputOTP){

            
            const data=new userSchema.userRegister(req.session.theuser)
            await data.save()
           
            console.log('data saved');
            req.flash('rg',`registration successfull`)
            res.redirect('/admin/')
            
        }else{
            req.flash('otpstatus','Incorrect OTP')
            res.redirect('/admin/otp');
                }
            }else{

                    req.flash('otpstatus','click resend OTP')
                }
            
            }else{
                 
                    res.redirect('/admin/register')
                }
    } catch (error) {
        console.log(error);
    }
}


const resentOTP=async(req,res)=>{
    try {
        if( req.session.theuser){
            await otps.deleteMany({email:req.session.theuser.User_email})
            let otp =  otp_email_generator(req.session.theuser.User_email)
            console.log("resent otp :"+otp)
            const newOTP=new otps({email:req.session.theuser.User_email,otp})
         const OTP=  await newOTP.save();
         req.flash('otp',OTP)
           res.redirect('/admin/otp') 
             } 
              else{
               res.redirect('/admin/register')
           }  
    } catch (error) {
        console.log(error);
    }
}



module.exports={LoginPage,registerPage,loadLoginForm,loadRegisterForm,homePage,otpPageRender,loadOTP,resentOTP}