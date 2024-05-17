const product=require('../models/admin_pro_schema')
async function getSortedProducts(sortBy) {
   
  
    let sortQuery = {};
  
    switch (sortBy) {
       
      case 'newArrival':
        sortQuery = { createdAt: -1 };
        break;
      case 'priceLowToHigh':
        sortQuery = { price: 1 };
        break;
      case 'priceHighToLow':
        sortQuery = { price: -1 };
        break;
      case 'aToZ':
        sortQuery = { product_name: 1 };
        break;
      case 'zToA':
        sortQuery = { product_name: -1 };
        break;
      default:
        throw new Error('Invalid sort option');
    }
 
    const products = await product.add_pro_model.find({is_list:false}).sort(sortQuery)
   
    return products;
  }
  
  module.exports = { getSortedProducts };