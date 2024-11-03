let userType = require('../db/model/userType');
const { success_function, error_function } = require('../utils/Response-Handler');
let products = require('../db/model/product-model');

exports.addProducts = async function(req, res) {
    let body = req.body;
    console.log("body", body);

    if (!body || Object.keys(body).length === 0) {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "Fields are required",
        });
        res.status(response.statusCode).send(response);
        return;
    }

    try {
        let productDetails = await products.create(body);
        if (productDetails) {
            let response = success_function({
                success: true,
                statusCode: 200,
                message: "Product added successfully",
                data: productDetails,
            });
            res.status(response.statusCode).send(response);
        } else {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "Product adding failed, try again",
            });
            res.status(response.statusCode).send(response);
        }
    } catch (error) {
        let response = error_function({
            success: false,
            statusCode: 500,
            message: "An error occurred while adding the product",
            error: error.message,
        });
        res.status(response.statusCode).send(response);
    }
};
