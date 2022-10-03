const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkToken = require('../middlewares/checkToken');

const {
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createNewProduct
}  = require('../controllers/productsController');

const storage = multer.diskStorage({
  destination : (req, file, callback) => {
    callback(null, './uploads/');
  },
  filename : (req, file, callback) => {
    callback(null, file.originalname);
  }
});

const fileFilter = (req, file, callback) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    callback(null, true);
  }else{
    callback(null, false);
  }
};

const upload = multer({
  storage : storage,
  limits : {
    fileSize : 1024 * 1024 * 5
  },
  fileFilter : fileFilter
});

router.get('/', getAllProducts);

router.post('/', upload.single('image'), checkToken, createNewProduct);

router.get('/:productId', getProductById);

router.patch('/:productId', checkToken, updateProduct);

router.delete('/:productId', checkToken, deleteProduct);

module.exports = router;