const users = require('../db/model/user-Model');
const admin_data = require('../db/model/admin');
const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
const { success_function, error_function } = require('../utils/Response-Handler');
const dotenv = require('dotenv');
dotenv.config();



exports.login = async function (req, res) {
    try {
        let { email, password } = req.body;

        // Check for missing email
        if (!email) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "Email is required",
            });
            res.status(response.statusCode).send(response);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "Invalid email format",
            });
            res.status(response.statusCode).send(response);
            return;
        }

        if (!password) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "Password is required",
            });
            res.status(response.statusCode).send(response);
            return;
        }

        // Find user in the users collection
        let check_user = await users.findOne({ email: email }).populate('userType')
        console.log("Checking email from users data:", check_user);

        if (check_user) {
            const isPasswordMatch = await bcrypt.compare(password, check_user.password);
            if (isPasswordMatch) {
                // Generate JWT token
                const token = jwt.sign({ id: check_user._id, role: 'user' }, process.env.PRIVATE_KEY, { expiresIn: '10d' });
                let response = success_function({
                    success: true,
                    statusCode: 200,
                    data: { user: check_user, token }
                });
                res.status(response.statusCode).send(response);
            } else {
                let response = error_function({
                    success: false,
                    statusCode: 401,
                    message: "Incorrect password",
                });
                res.status(response.statusCode).send(response);
            }
            return;
        }

        // If no user found, check in the admin collection
        let check_admin = await admin_data.findOne({ email: email }).populate('userType')
        console.log("Checking email from admin data:", check_admin);

        if (check_admin) {
            const isPasswordMatch = await bcrypt.compare(password, check_admin.password);
            if (isPasswordMatch) {
                // Generate JWT token for admin
                const token = jwt.sign({ id: check_admin._id, role: 'admin' }, process.env.PRIVATE_KEY, { expiresIn: '1h' });
                let response = success_function({
                    success: true,
                    statusCode: 200,
                    message: "Admin login successful",
                    data: { admin: check_admin, token }
                });
                res.status(response.statusCode).send(response);
            } else {
                let response = error_function({
                    success: false,
                    statusCode: 401,
                    message: "Incorrect password",
                });
                res.status(response.statusCode).send(response);
            }
            return;
        }

        // If neither user nor admin found, respond with user not found
        let response = error_function({
            success: false,
            statusCode: 404,
            message: "User not found",
        });
        res.status(response.statusCode).send(response);

    } catch (error) {
        console.error("Error during login:", error);
        let response = error_function({
            success: false,
            statusCode: 500,
            message: "An error occurred during login",
        });
        res.status(response.statusCode).send(response);
    }
};
