const express = require('express');
const Router = express.Router();
const usercontroller = require('../product-Controller/controller');
const accessControl = require('../product-Controller/access-Controller').accessControl



function setAccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}

Router.post('/signin',setAccessControl('*'),usercontroller.signin)
Router.get('/getUserType',usercontroller.getUserTypes);
Router.get('/users',setAccessControl('*'),usercontroller.getAllUsers);
Router.get('/user/:id',setAccessControl('*'),usercontroller.getUser);

module.exports = Router