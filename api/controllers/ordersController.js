const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

const getAllOrders = (req, res) => {
  Order.find().select('_id product quantity').populate('product', '_id name price image')
  .then(docs => {
    return res.status(200).json({
      count : docs.length,
      orders : docs
    });
  })
  .catch(err => {
    return res.status(500).json({
      error : err.message
    });
  });
};

const createNewOrder = (req, res) => {

  Product.findById(req.body.product)
  .then(_result => {
    if(_result){
      const order = new Order({
        _id : new mongoose.Types.ObjectId(),
        product : req.body.product,
        quantity : req.body.quantity
      });
      
      return order.save();
    
    }else{
      return res.status(404).json({
        error : {
          message : 'Not found'
        }
      });
    }
  })
  .then(result => {
    return res.status(201).json({
      success : true,
      createdOrder : {
        _id : result._id,
        product : result.product,
        quantity : result.quantity
      }
    });
  })
  .catch(err => {
    return res.status(500).json({
      error : err.message
    });
  });
};

const getOrderById = (req, res) => {
  const { orderId } = req.params
  Order.findById(orderId).select('_id product quantity').populate('product', '_id name price image')
  .then(result => {
    if(result){
      return res.status(200).json(result);
    }else{
      return res.status(404).json({
        error : {
          message : 'Not found'
        }
      });
    }
  })
  .catch(err => {
    return res.status(500).json({
      error : err.message
    });
  });
};

const deleteOrderById = (req, res) => {
  const { orderId } = req.params
  Order.deleteOne({ _id : orderId })
  .then(result => {
    if(result.deletedCount === 0){
      return res.status(404).json({
        success : false,
        error : {
          message : 'Not found'
        }
      })
    }else{
      return res.status(200).json({
        success : true,
        message : 'order successfully deleted'
      });
    }
  })
  .catch(err => {
    return res.status(500).json({
      error : err.message
    });
  });
};

module.exports = {
  getAllOrders,
  getOrderById,
  createNewOrder,
  deleteOrderById
}