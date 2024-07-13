
const helpfunctions=require('../../functions/helpFunctions')
const sortProduct=async(req,res,next)=>{
    try {
        
       const sort=req.query.sort
       const product=await helpfunctions.getSortedProducts(sort)
        req.session.sort=product
        req.session.save()

    } catch (error) {
        next(error)
    }
}
module.exports=sortProduct