const users = require('../db/model/user-Model');
const admin = require('../db/model/admin');
const bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken');
const { success_function, error_function } = require('../utils/Response-Handler')
const dotenv = require('dotenv')
dotenv.config()


exports.login = async function(req,res){
    let body = req.body;

    let email = req.body.email;
    console.log("email : ",email);

    if(!email){
        let response = error_function({
            success : false,
            statusCode : 400,
            message : "Enter the email", 
        });
        res.status(response.statusCode).send(response);
        return;
    }
    if(email){

    }
}