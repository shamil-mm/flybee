const product_data=require('../../models/admin_pro_schema')
const homesearch=async(req,res)=>{
    try {
        let search ='';
        let limit=8;
        let page=1;
    if (req.query.search) {
        search = req.query.search.trim();   
    }
    if (req.query.page) {
        page = req.query.page   
    }
    const searchProduct = await product_data.add_pro_model.find({
       is_list:false,
       $or: [
            { product_name: { $regex:`.*${search}.*`, $options: 'i' } },
            { Description: { $regex:`.*${search}.*`, $options: 'i' } }
        ]
   
    }).populate('category').limit(limit*1).skip((page-1)*limit)

    const cound_Product = await product_data.add_pro_model.find({
        $and:[{$or: [
            { product_name: { $regex:`.*${search}.*`, $options: 'i' } },
            { Description: { $regex:`.*${search}.*`, $options: 'i' } },
        ]},
    ],
    }).populate('category').countDocuments();
   
    let pagecount=Math.ceil(cound_Product/limit)
   
    res.render('searchresult', {product: searchProduct,pagecount,search});
    } catch (error) {
        console.log(error);
     }
    }
    module.exports=homesearch