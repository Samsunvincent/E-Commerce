const express = require('express');
const Router = express.Router();
const productController = require('../Controller/sellerController')
const accessControl = require('../Controller/access-Controller').accessControl
const upload = require('../utils/FileUpload')


function setAccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}

// Router.post('/addProducts',upload.array('images',5),setAccessControl('3'),productController.addProducts);
// Router.post('/addProducts',upload.array('images', 5),setAccessControl('3'),productController.addProducts);

Router.post('/addProducts', upload, productController.addProducts);


module.exports = Router
