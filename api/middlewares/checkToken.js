const jwt = require('jsonwebtoken');

const User = require('../models/user');

const checkToken = (req, res, next) => {
  jwt.verify(req.body.token, 'shhhhhhhh', (err, decoded) => {
    if(err){
      return res.status(500).json({
        success : false,
        error : {
          message : 'invalid or missing token'
        }
      });
    }else{
      User.findOne({ _id : decoded._id, email : decoded.email })
      .then(result => {
        if(!result){
          return res.status(401).json({
            success : false,
            error : {
              message : 'invalid or missing token'
            }
          });
        }else{
          next();
        }
      })
      .catch(err => {
        return res.status(500).json({
          error : err.message
        });
      });
    }
  })
};

module.exports = checkToken;


