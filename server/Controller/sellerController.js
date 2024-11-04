let userType = require('../db/model/userType');
const { success_function, error_function } = require('../utils/Response-Handler');
let products = require('../db/model/product-model');

exports.addProducts = async function(req, res) {
    let body = req.body;
    console.log("body", body);

    try {
        // Check if body is empty
        if (!body || Object.keys(body).length === 0) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "Fields are required",
            });
            res.status(response.statusCode).send(response);
            return;
        }

        // Attempt to create the product
        let productDetails = await products.create(body);
        let response = success_function({
            success: true,
            statusCode: 200,
            message: "Product added successfully",
            data: productDetails,
        });
        res.status(response.statusCode).send(response);
        
    } catch (error) {

        console.log("error ",error)
        // Handle any errors during product creation
        let response = error_function({
            success: false,
            statusCode: 500, // Change to 500 for server error
            message: "Product adding failed, try again",
        });
        res.status(response.statusCode).send(response);
    }
};
