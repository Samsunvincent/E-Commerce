const jwt = require('jsonwebtoken');
let user = require('../db/model/user-Model')
const dotenv = require('dotenv');
dotenv.config();

const control_data = require('../Controller/contol-Data.json');




const {success_function , error_function} = require('../utils/Response-Handler');

exports.accessControl = async function (access_types,req,res,next){
    try {
       

        if(access_types === '*'){
            next();

        }else{
            const authHeader = req.headers['authorization'];
            console.log("authHeader : ",authHeader);

            if(!authHeader){
                let response = error_function({
                    statusCode : 400,
                    message : "please login to continue"
                });
                res.status(response.statusCode).send(response);
                return;

            }

            const token = authHeader.split(" ")[1];
            console.log('token',token);

            if(!token || token==null || token ==undefined || token == ""){
                let response = error_function({
                    statusCode : 400,
                    message : "Invalid access token"
                });
                res.status(response.statusCode).send(response);
                return;
            }else{
                jwt.verify(token, process.env.PRIVATE_KEY, async function(err,decoded){
                    if(err){
                        let response = error_function({
                            statusCode : 400,
                            message : err.message ? err.message : "authentication failed"
                        })
                        res.status(response.statusCode).send(response);
                        return;

                    }
                    else{
                        console.log("decoded",decoded);

                        let user_data = await user.findOne({_id : decoded.id}).populate("userType");
                        console.log("user from access control",user_data);

                        
                        console.log("user",user_data);

                        let id = user_data._id;
                        console.log("id from access control",id);

                        // req.params = id;
                        // console.log("req.params",req.params);

                        let user_type = user_data.userType.userType;
                        console.log('user_type',user_type);

                        let allowed = access_types.split(",").map((obj)=>control_data[obj]);
                        console.log("allowed",allowed);

                        if(allowed && allowed.includes(user_type)){
                            next();

                        }else{
                            let response = error_function({
                                statusCode : 400,
                                message : "Not allowed to access the route"
                            });
                            res.status(response.statusCode).send(response);
                            return;
                        }
                        

                      

                    }
                })

                }
            }

        }
    catch (error) {
        console.log("error",error);

        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : "something went wrong",

        });
        res.status(response.statusCode).send(response)
    }
}


