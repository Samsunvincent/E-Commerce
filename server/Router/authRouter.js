const express = require('express');
const router = express.Router();
const authcontroller = require('../Controller/auth-Controller');
const accessControl = require('../Controller/access-Controller').accessControl

function setAccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}

router.post('/login',setAccessControl('*'),authcontroller.login);






module.exports = router