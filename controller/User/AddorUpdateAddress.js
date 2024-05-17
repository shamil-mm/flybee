const Address=require('../../models/userAddress')
const AddorUpdateAddress=async(req,res)=>{
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
console.log('session cleared')
res.redirect('/homePage')
}

    } catch (error) {
        console.log(error);
    }
} 
module.exports=AddorUpdateAddress