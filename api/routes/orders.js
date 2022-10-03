const express = require('express');

const router = express.Router();

const checkToken = require('../middlewares/checkToken');

const {
  getAllOrders,
  getOrderById,
  createNewOrder,
  deleteOrderById
} = require('../controllers/ordersController');

router.get('/', checkToken, getAllOrders);

router.post('/', createNewOrder);

router.get('/:orderId', getOrderById);

router.delete('/:orderId', deleteOrderById);


module.exports = router;