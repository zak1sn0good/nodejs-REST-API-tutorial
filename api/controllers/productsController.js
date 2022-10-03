const mongoose = require('mongoose');
const Product = require('../models/product');

const getAllProducts = (req, res) => {
  
  Product.find()
  .select('image name price _id')
  .then(docs => {
    const responseObject = {
      count : docs.length,
      products : docs
    };
    return res.status(200).json(responseObject);
  })
  .catch(err => {
    return res.status(500).json({
      error : err.message
    });
  });
};

const createNewProduct = (req, res) => {
  
  const product = new Product({
    _id : new mongoose.Types.ObjectId(),
    name : req.body.name,
    price : req.body.price,
    image : req.file.path
  });

  product.save()
  .then(result => {
    return res.status(201).json({
      success : true,
      createdProduct : {
        _id : result._id,
        name : result.name,
        price : result.price,
        image : result.image
      }
    });
  })
  .catch(err => {
    return res.status(500).json({
      success : false,
      error : err.message
    });
  });
};

const getProductById = (req, res) => {
  
  const { productId }  = req.params
  
  Product.findById(productId).select('image name price _id')
  .then((doc) => {
    if(doc){
      return res.status(200).json(doc);
    }else{
      return res.status(404).json({
        error : {
          message : 'Not found'
        } 
      });
    }
  })
  .catch((err) => {
    return res.status(500).json({
      error : err.message 
    });
  });
};

const updateProduct = (req, res) => {
  
  const { productId }  = req.params
  
  const updatedOps = {};
  for(op in req.body){
    console.log(op);
    updatedOps[op] = req.body[op];
  }

  Product.updateOne({_id : productId}, {$set : updatedOps})
  .then(result => {
    return res.status(200).json({
      success : true,
      message : 'product successfully updated'
    });
  })
  .catch(err => {
    return res.status(500).json({
      success : false,
      message : err.message
    });
  });
  
};

const deleteProduct = (req, res) => {
  const { productId }  = req.params
  Product.deleteOne({_id : productId})
  .then(result => {
    if(result.deletedCount === 0){
      return res.status(404).json({
        success : false,
        message : 'Not found'
      });
    }else{
      return res.status(200).json({
        success : true,
        message : 'product successfully deleted'
      });
    }
    
  })
  .catch(err => {
    return res.status(500).json({
      success : false,
      error : err.message
    });
  }); 
};

module.exports = {
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createNewProduct
}