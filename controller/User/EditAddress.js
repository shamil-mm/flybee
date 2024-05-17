const EditAddress=async(req,res)=>{
    try {
        res.render('editaddress')
    } catch (error) {
        console.log(error)
    }
}
module.exports=EditAddress