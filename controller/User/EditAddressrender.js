const Address=require('../../models/userAddress')
const EditAddressrender=async(req,res)=>{
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
        console.log(error)
    }
}
module.exports=EditAddressrender