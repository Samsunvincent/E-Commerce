const express = require('express');
const Router = express.Router();
const productController = require('../Controller/produc-Controller')
const accessControl = require('../Controller/access-Controller').accessControl



function setAccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}

Router.post('/addProducts',setAccessControl('3'),productController.addProducts);

module.exports = Router
