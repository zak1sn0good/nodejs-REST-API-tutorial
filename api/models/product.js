const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  name : {
    required : true,
    type : String
  },
  price : {
    required : true,
    type : Number
  },
  image : {
    required : true,
    type : String
  }
});

module.exports = mongoose.model('Product', productSchema);