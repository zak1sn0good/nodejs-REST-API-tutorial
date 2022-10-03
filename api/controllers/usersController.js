const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const createNewUser = (req, res) => {
  User.find({email : req.body.email})
  .then(docs => {
    if(docs.length > 0){
      return res.status(409).json({
        success : false,
        error : {
          success : false,
          message : 'email adress already in use'
        }
      });
    }else{
      bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          _id : new mongoose.Types.ObjectId(),
          email : req.body.email,
          password : hash
        });
        return user.save();
      })
      .then(result => {
        return res.status(201).json({
          success : true,
          createduser : {
            _id : result._id,
            email : result.email,
            password : result.password
          }
        });
      })
      .catch(err => {
        return res.status(500).json({
          error : err.message
        });
      });
    }
  })
  .catch(err => {
    return res.status(500).json({
      error : err.message
    });
  });
};

const logIn = (req, res) => {
  User.findOne({ email : req.body.email })
  .then(result => {
    if(!result){
      return res.status(401).json({
        success : false,
        error : {
          message : 'failed to authenticate'
        }
      });
    }else{
      bcrypt.compare(req.body.password, result.password)
      .then(isValid => {
        if(isValid){
          jwt.sign({
            email : result.email,
            _id : result._id
          }, 'shhhhhhhh', { expiresIn : "1h" }, (err, token) => {
            if(err){
              return res.status(500).json({
                error : err.message
              });
            }else{
              return res.status(200).json({
                success : true,
                token : token
              });
            }
          });
        }else{
          return res.status(401).json({
            success : false,
            error : {
              message : 'failed to authenticate'
            }
          }); 
        }
      })
      .catch(err => {
        return res.status(500).json({
          error : err.message
        });
      });
    }
  })
  .catch(err => {
    return res.status(500).json({
      error : {
        message : err.message
      }
    });    
  });
};

const deleteUser = (req, res) => {
  User.deleteOne({ _id : req.params.userId })
  .then(result => {
    if(result.deletedCount === 0){
      return res.status(404).json({
        error : {
          success : false,
          message : 'not found'
        }
      });
    }else{
      return res.status(200).json({
        success : true,
        message : 'user deleted successfully'
      });
    }
  })
  .catch(err => {
    return res.status(500).json({
      error : {
        message : err.message
      }
    });
  });
};

module.exports = {
  createNewUser,
  logIn,
  deleteUser
};