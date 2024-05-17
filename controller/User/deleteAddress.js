const Address=require('../../models/userAddress')
const deleteAddress=async(req,res)=>{
    try {
       await Address.findOneAndUpdate({userId:req.session.user_id},{$pull:{addresses:{_id:req.query.id}}})
       res.redirect('/personalInfo')
    } catch (error) {
        console.log(error)
    }
}
module.exports=deleteAddress