let user = require('../db/model/user-Model')
const { success_function, error_function } = require('../utils/Response-Handler')
let userType = require('../db/model/userType')
const bcrypt = require('bcrypt');

const category = require('../db/model/category');





exports.signin = async function (req, res) {
    let body = req.body;
    console.log("body :", body);

    if (body) {
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "Invalid email format"
            });
            res.status(response.statusCode).send(response);
            return;
        }

        // Check if Address exists and validate pincode
        // if (body.Address && body.Address.pincode) {
        //     const pincodeRegex = /^\d{6}$/;
        //     if (!pincodeRegex.test(body.Address.pincode)) {
        //         let response = error_function({
        //             success: false,
        //             statusCode: 400,
        //             message: "Pincode must be exactly 6 digits"
        //         });
        //         res.status(response.statusCode).send(response);
        //         return;
        //     }
        // } else {
        //     let response = error_function({
        //         success: false,
        //         statusCode: 400,
        //         message: "Address and pincode are required"
        //     });
        //     res.status(response.statusCode).send(response);
        //     return;
        // }

        // Phone number validation (if needed, adjust your request to include a phone number)
        let phone = body.phone
        if (phone) {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(body.phone)) {
                let response = error_function({
                    success: false,
                    statusCode: 400,
                    message: "Phone number must be exactly 10 digits"
                });
                res.status(response.statusCode).send(response);
                return;
            }
        }


        try {
            // Check for duplicate email
            let existingUser = await user.findOne({ email: body.email });
            if (existingUser) {
                let response = error_function({
                    success: false,
                    statusCode: 400,
                    message: "Email already exists"
                });
                res.status(response.statusCode).send(response);
                return;
            }

            let users = await userType.findOne({ userType: body.userType });
            if (!users) {
                let response = error_function({
                    success: false,
                    statusCode: 400,
                    message: "Invalid user type"
                });
                res.status(response.statusCode).send(response);
                return;
            }

            let id = users._id;
            body.userType = id;

            // Hash the password
            const saltRounds = 10; // You can adjust the salt rounds for security
            body.password = await bcrypt.hash(body.password, saltRounds);

            // Create user and save to the database
            let data = await user.create(body);

            if (data) {
                let response = success_function({
                    success: true,
                    statusCode: 200,
                    message: "Signup successful",
                    data: data
                });
                res.status(response.statusCode).send(response);
                return;
            } else {
                let response = error_function({
                    success: false,
                    statusCode: 400,
                    message: "Signup failed, try again"
                });
                res.status(response.statusCode).send(response);
                return;
            }
        } catch (error) {
            console.log("error", error);
            let response = error_function({
                success: false,
                statusCode: 500,
                message: "Something went wrong, try again"
            });
            res.status(response.statusCode).send(response);
            return;
        }
    }
};

exports.getUserTypes = async function(req,res){
    try {
        let selectUserTypes = await userType.find();
       

        if(selectUserTypes){
            let response = success_function({
                success : true,
                statusCode : 200,
                message : "successfully fetched the userTypes",
                data : selectUserTypes
            });
            res.status(response.statusCode).send(response);
            return;
        }
    } catch (error) {
        console.log('error',error);

        let response = error_function({
            success : false,
            statusCode : 400,
            message : "userType fetching failed",
            
        });
        res.status(response.statusCode).send(response)
        return;
    }

}

exports.getAllUsers = async function(req, res) {
    try {
        // Fetch all users from the database
        let users = await user.find();

        // Log the retrieved users
        console.log("Fetched users:", users);

        // Check if users were found
        if (!users || users.length === 0) {
            let response = {
                success: true,
                statusCode: 200,
                message: "No users found",
                data: []
            };
            res.status(response.statusCode).send(response);
            return;
        }

        // Send the users back to the client
        let response = {
            success: true,
            statusCode: 200,
            message: "Users fetched successfully",
            data: users
        };
        res.status(response.statusCode).send(response);
        
    } catch (error) {
        // Log the error
        console.log("Error fetching users:", error);
        
        // Send an error response
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "Users fetching failed"
        });
        res.status(response.statusCode).send(response);
    }
};

exports.getUser = async function(req,res){
    try {
        let id = req.params.id;
    console.log("id from single user",id);

    if(!id){
        let response = error_function({
            success : false,
            statusCode : 400,
            messsage : "something went wrong"
        });
        res.status(response.statusCode).send(response);
        return;
    }else{
        let singleUser = await user.findOne({_id : id});
        console.log("singleUser",singleUser);
        
        if(!singleUser){
            let response = error_function({
                success : false,
                statusCode : 400,
                message : "User not found",

            });
            res.status(response.statusCode).send(response);
            return;
        }else{
            let response = success_function({
                success : true,
                statusCode : 200,
                message : "User found",
                data : singleUser
            });
            res.status(response.statusCode).send(response);
            return
        }
    }
    } catch (error) {
        console.log('error',error);

        let response = error_function({
            success : false,
            statusCode : 400,
            message : "Something went wrong, try again"
        });
        res.status(response.statusCode).send(response);
        requestAnimationFrame;
    }
}

exports.getCategory = async function(req,res){
    try {
        let categories = await category.find();

        if(categories){
            let response = success_function({
                success : true,
                statusCode : 200,
                message : null,
                data : categories
            });
            res.status(response.statusCode).send(response);
            return;
        }
    } catch (error) {
        console.log("error",error);
        let response = error_function({
            success : false,
            statusCode : 400,
            message : "something went wrong try again"
        });
        res.status(response.statusCode).send(response);
    }
}

