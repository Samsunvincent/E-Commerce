let user = require('../db/model/user-Model')
const { success_function, error_function } = require('../utils/Response-Handler')
let userType = require('../db/model/userType')


const bcrypt = require('bcrypt');





exports.signup = async function (req, res) {
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
        if (body.Address && body.Address.pincode) {
            const pincodeRegex = /^\d{6}$/;
            if (!pincodeRegex.test(body.Address.pincode)) {
                let response = error_function({
                    success: false,
                    statusCode: 400,
                    message: "Pincode must be exactly 6 digits"
                });
                res.status(response.statusCode).send(response);
                return;
            }
        } else {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "Address and pincode are required"
            });
            res.status(response.statusCode).send(response);
            return;
        }

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


