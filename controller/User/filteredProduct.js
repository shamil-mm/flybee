const productSchema=require('../../models/productSchema')
const filteredProduct=async(req,res)=>{
    try {
        let page=req.query.page ||1
        
       
        
       
        let search=''
        const categoryId=req.query.cateid 
        if (req.query.search){
            search = req.query.search.trim();   
        }
        if(page==1){
        const searchProduct = await productSchema.add_pro_model.find({
           is_list:false,
           $or: [
                { product_name: { $regex:`.*${search}.*`, $options: 'i' } },
                { Description: { $regex:`.*${search}.*`, $options: 'i' } }
            ]
       
        }).populate('category')

        const updatedFilterData= searchProduct.filter((value)=>{
           return value.category._id==categoryId
        })
        req.session.FilterData=updatedFilterData
        
        
        let pagecount=Math.ceil(updatedFilterData.length/8)
        const paginatedData = updatedFilterData.slice((page - 1) * 8, page * 8);
         res.json({updatedFilterData:paginatedData,pagecount,search})
    }else{
        let pagecount=Math.ceil(req.session.FilterData.length/8)
        const paginatedData = req.session.FilterData.slice((page - 1) * 8, page * 8);

         res.json({updatedFilterData:paginatedData,pagecount,search})
    }
    } catch (error) {
        console.log(error)
    }
}
module.exports=filteredProduct