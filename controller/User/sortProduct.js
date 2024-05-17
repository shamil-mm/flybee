const helpfunctions=require('../../functions/helpFunctions')
const sortProduct=async(req,res)=>{
    try {
        
       const sort=req.query.sort
       const product=await helpfunctions.getSortedProducts(sort)
        req.session.sort=product
        req.session.save()

    } catch (error) {
        console.log(error)
    }
}
module.exports=sortProduct