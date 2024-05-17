const aDdetails=async(req,res)=>{
    try {
        res.render('adminOrdersdetail')
        
    } catch (error) {
        console.log(error)
    }
}
module.exports=aDdetails