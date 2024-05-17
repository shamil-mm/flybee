const aDregister=async(req,res)=>{
    try {
        res.render('adminRegister')
    } catch (error){
        console.log(error)
    }
}
module.exports=aDregister