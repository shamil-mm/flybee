const filteredProduct=async(req,res)=>{
    try {
        console.log(req.query.size)
     
       const categoryId=req.query.id.split(',') || null
       const result=await product_data.add_pro_model.find({category:categoryId}).populate('category')
      console.log(result)
      
    } catch (error) {
        console.log(error)
    }
}
module.exports=filteredProduct