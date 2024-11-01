const express = require('express');
const Router = express.Router();
const usercontroller = require('../product-Controller/controller');
const accessControl = require('../product-Controller/access-Controller').accessControl



function setAccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}

Router.post('/signup',setAccessControl('*'),usercontroller.signup)

module.exports = Router