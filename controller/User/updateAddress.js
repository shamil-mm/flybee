const Address=require('../../models/userAddress')
const updateAddress=async(req,res)=>{
    try {
        const{name,country,address,city,state,pincode,phone,email}=req.body
        const data=await Address.findOne({userId:req.session.user_id})
       const data1= data.addresses.find((value)=>{
            return value._id.equals(req.query.id)
        })
  
        data1.name=name;
        data1.address=address;
        data1.email=email;
        data1.country=country;
        data1.city=city;
        data1.state=state;
        data1.pincode=pincode;
        data1.phone=phone;
        data.save()
        res.redirect('/personalInfo')
    } catch (error) {
        console.log(error);
    }
}
module.exports=updateAddress