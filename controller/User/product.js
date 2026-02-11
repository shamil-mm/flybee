
const {Product}=require('../../models/productSchema')
const {Category}=require('../../models/categorySchema')
const Offer=require('../../models/offerSchema')
const offerHelper=require('../../functions/offerCalculations')


const productPageRender=async(req,res,next)=>{
    try {
      const cate_list=await Category.find({is_delete:false,is_list:false})
      res.render('product',{msg:req.flash('msg'),cate_list})
    } catch (error) {
        next(error)
    }
}



const mensPageRender=async(req,res,next)=>{
    try {
      const data= await Product.find({}).populate("category")
      const menProducts=data.filter((product)=>{
        return product.category.name=="Men's"
    })
    
       res.render('mens',{men:menProducts}) 
    } catch (error) {
        next(error);
    }
}
const womensPageRender=async(req,res,next)=>{
  try {
      const data=await Product.find({}).populate('category')
      const womensproduct=data.filter((product)=>{
          return product.category.name=="Women's"
      })
     
      res.render('womens',{women:womensproduct})
  } catch (error) {
      next(error);
  }
}


const productViewPage=async(req,res,next)=>{
    try {
        const id =req.query.id
        const singleData= await Product.findOne({_id:id}).populate('category')
       res.render('productView',{singleData})
    } catch (error) {
        next(error);
    }
}

const fetchProducts = async (req, res, next) => {
  try {
    

    let {
      search = "",
      category = [],
      size = [],
      minPrice,
      maxPrice,
      sort = "newArrival",
      page = 1,
    } = req.query;

    category = category ? Array.isArray(category) ? category : [category] : [];
    size = size ? Array.isArray(size) ? size : [size] : [];
    page = Number(page);
    

    const limit = 8;
    const skip = (page - 1) * limit;

    const query = {
      is_delete: false,
      is_list: false,
    };

    if (search.trim()) {
      query.$or = [
        { product_name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }


    if (category.length > 0) {
      query.category = { $in: category };
    }


    if (size.length || minPrice || maxPrice) {
      query.variants = {
        $elemMatch: {
          is_active: true,
          ...(size.length && { size: { $in: size } }),
          ...((minPrice || maxPrice) && {
            price: {
              ...(minPrice && { $gte: Number(minPrice) }),
              ...(maxPrice && { $lte: Number(maxPrice) }),
            },
          }),
        },
      };
    }

    let sortQuery = {};
    switch (sort) {
      case "priceHighToLow":
        sortQuery["variants.price"] = -1;
        break;
      case "priceLowToHigh":
        sortQuery["variants.price"] = 1;
        break;
      case "aToZ":
        sortQuery.product_name = 1;
        break;
      case "zToA":
        sortQuery.product_name = -1;
        break;
      default:
        sortQuery.createdAt = -1;
    }

    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("category")
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean();
    const productsWithOffer = await Promise.all(
      products.map(async (product) => {
        let productOffer = 0;
        let categoryOffer = 0;

        const productOffers = await offerHelper.getActiveProductOffers(product._id);
        const categoryOffers = await offerHelper.getActiveCategoryOffers(product.category._id);

        productOffers.forEach(o => productOffer = Math.max(productOffer, o.offerPrecentage));
        categoryOffers.forEach(o => categoryOffer = Math.max(categoryOffer, o.offerPrecentage));

        return {
          ...product,
          finalPercentage: Math.max(productOffer, categoryOffer),
        };
      })
    );



    res.json({
      products:productsWithOffer,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });

  } catch (error) {
    next(error);
  }
};



module.exports={productPageRender,mensPageRender,womensPageRender,productViewPage,fetchProducts }