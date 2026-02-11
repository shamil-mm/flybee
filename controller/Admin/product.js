const { Category } = require('../../models/categorySchema')
const { Product } = require('../../models/productSchema')
const paginate = require('../../functions/pagination')
const fs = require('fs')
const order = require('../../models/orderSchema')
const {uploadToCloudinary}=require('../../functions/uploadToCloudinary')
const cloudinary = require("cloudinary").v2
const {isBase64Image}=require('../../functions/isBase64')

const editProductPageRender = async (req, res) => {
  try {
    const Data = await Product.findOne({ _id: req.query.id }).populate(
      'category',
    )
    const category = await Category.find({ is_delete: false, is_list: false })

    res.render('adminEditproduct', {
      data: Data,
      category,
      msg: req.flash('msg'),
    })
  } catch (error) {
    console.log('error')
  }
}

const productPageRender = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = 8
    const search=req.query.search || "";
    const Query = { is_delete: false }

    if (search) {
      Query.product_name = { $regex: search.trim(), $options: 'i' }
    }

    const finalData = await paginate(Product, page, limit, Query)

    res.render('adminProducts', {
      data: finalData.results,
      totalPages: finalData.totalPages,
      currentPage: finalData.currentPage,
      search,
      msg: req.flash('msg'),
      msg1: req.flash('msg1'),
    })
  } catch (error) {
    console.log(error)
  }
}

const productListUnlistLoader = async (req, res) => {
  try {
    const checkData = await Product.findOne({ _id: req.query.id })
    if (checkData.is_list == false) {
      const data = await Product.updateOne(
        { _id: req.query.id },
        { $set: { is_list: true } },
      )
    } else if (checkData.is_list == true) {
      const data = await Product.updateOne(
        { _id: req.query.id },
        { $set: { is_list: false } },
      )
    }
  } catch (error) {
    console.log(error)
  }
}

const addProductPageRender = async (req, res) => {
  try {
    const products = await Category.find({ is_delete: false, is_list: false })
    res.render('adminAddproduct', { category: products })
  } catch (error) {
    console.log(error)
  }
}

const addProductLoad = async (req, res) => {
  try {
    const { product_name, brand, description, checkbox1 } = req.body;
    let { variants } = req.body;

    if (!product_name || !brand || !description) {
      req.flash('msg', 'Missing required fields');
      return res.redirect('/admin/products');
    }

    const normalizedTitle = product_name.trim().toLowerCase();
    const repeatData = await Product.findOne({
      product_name: { $regex: `^${normalizedTitle}$`, $options: 'i' },
    });

    if (repeatData) {
      req.flash('msg', 'Product already exists');
      return res.redirect('/admin/products');
    }

    variants = (variants || []).filter(v => v);
    const productVariants = [];
    for (const variant of variants) {
      const images = [];
      if (variant.images && variant.images.length > 0) {
        for (const base64 of variant.images) {
          const url = await uploadToCloudinary(base64, 'products');
          images.push(url);
        }
      }

      productVariants.push({
        size: variant.size,
        color: variant.color,
        price: Number(variant.price),
        stock: Number(variant.stock),
        images, 
      });
    }

    if (productVariants.length === 0) {
      req.flash('msg', 'At least one variant is required');
      return res.redirect('/admin/products');
    }

    const product = new Product({
      product_name: normalizedTitle,
      brand,
      description,
      category: checkbox1,
      variants: productVariants,
    });

    await product.save();
    req.flash('msg1', 'Product saved successfully');
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
    req.flash('msg', 'Something went wrong');
    res.redirect('/admin/products');
  }
}
let croppedimages = []
const imageUpload = async (req, res) => {
  try {
    croppedimages.push(req.file.filename)
  } catch (error) {
    console.log(error)
  }
}

const editProductLoad = async (req, res) => {
  try {
    const { product_name, brand, description, checkbox1 } =req.body
    let { variants } = req.body;

    const product = await Product.findById(req.query.id);
     if (!product) {
      req.flash('msg1', 'Product not found');
      return res.redirect('/admin/products');
    }
    const existingProduct = await Product.findOne({
      product_name,
      _id: { $ne: req.query.id }
    });
    if (existingProduct) {
      req.flash('msg1', 'A product with the same name already exists');
      return res.redirect('/admin/products');
    }

    product.product_name = product_name;
    product.brand = brand;
    product.description = description;
    product.category = checkbox1;
    
    variants = Object.values(variants || {});
    const updatedVariants = [];
for (const variant of variants) {
      const finalImages = [];
      if (Array.isArray(variant.existingImages)) {
        for (const img of variant.existingImages) {
          if (isBase64Image(img)) {
            const url = await uploadToCloudinary(img, 'products');
            finalImages.push(url);
          } else {
            finalImages.push(img);
          }
        }
      }
      if (Array.isArray(variant.images)) {
        for (const img of variant.images) {
          if (isBase64Image(img)) {
            const url = await uploadToCloudinary(img, 'products');
            finalImages.push(url);
          }
        }
      }

      updatedVariants.push({
        size: variant.size,
        color: variant.color,
        price: Number(variant.price),
        stock: Number(variant.stock),
        images: finalImages,
        is_active: true
      });
    }

    product.variants = updatedVariants;
    await product.save();

    req.flash('msg1', 'Product updated successfully');
    res.redirect('/admin/products');
  } catch (error) {
    console.log(error)
  }
}

const deletedProductPageRender = async (req, res) => {
  try {
    const data = await Product.find({ is_delete: true })

    res.render('Admindeletedproduct', { data })
  } catch (error) {
    console.log(error)
  }
}

const productDelete = async (req, res) => {
  try {
    const productCheckInOrder = await order.findOne({
      'OrderedProducts.productId': req.query.id,
    })
    if (!productCheckInOrder) {
      await Product.updateOne(
        { _id: req.query.id },
        { $set: { is_delete: true } },
      )
      res.json({ success: `product delete` })
    } else {
      res.json({ fail: `product fount in order! You Cant't delete` })
    }
  } catch (error) {
    console.log(error)
  }
}

const productRecover = async (req, res) => {
  try {
    await Product.updateOne(
      { _id: req.query.id },
      { $set: { is_delete: false } },
    )
  } catch (error) {
    console.log(error)
  }
}

const deleteProductPermanently = async (req, res) => {
  try {
    const {id} = req.query

    const product = await Product.findById(id)
    if (!product) {
      return res
        .status(404)
        .json({ error:  "Product not found"  })
    }
    for (const variant of product.variants) {
      if (variant.images && variant.images.length > 0) {
        for (const imageUrl of variant.images) {

          const publicId = imageUrl
            .split("/upload/")[1]
            .split(".")[0]
            .replace(/^v\d+\//, "")

          await cloudinary.uploader.destroy(publicId)
        }
      }
    }
    await Product.deleteOne({ _id: id })

    return res.status(200).json({
      message: "Product and all variant images deleted permanently"
    })

  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  addProductPageRender,
  productDelete,
  productPageRender,
  editProductPageRender,
  editProductLoad,
  deletedProductPageRender,
  productRecover,
  deleteProductPermanently,
  productListUnlistLoader,
  addProductLoad,
  imageUpload,
}

