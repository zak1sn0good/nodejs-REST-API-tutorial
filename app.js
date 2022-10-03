const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const usersRoutes = require('./api/routes/users');

mongoose.connect('mongodb+srv://root:root@cluster0.xifuxzk.mongodb.net/?retryWrites=true&w=majority', (err) => {
  if(err){
    console.log('failerd to connect to the Database!');
  }else{
    console.log('connected to the Database!...');
  }
});

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/users', usersRoutes);
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found!');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error : {
      message : err.message
    }
  });
});


module.exports = app;