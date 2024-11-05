let userType = require('../db/model/userType');
const { success_function, error_function } = require('../utils/Response-Handler');
let products = require('../db/model/product-model');
let category = require('../db/model/category')


exports.addProducts = async function(req, res) {
    const body = req.body;
    console.log("Request body:", body);

  

    let body_category = body.category;
    console.log("body category",body_category);

    let match_category = await category.findOne({category : body_category});
    console.log("matchcategory",match_category);

    body.category = match_category;
    console.log("body.category",body.category);

    try {
        // Check if the request body is empty
        if (!body || Object.keys(body).length === 0) {
            const response = error_function({
                success: false,
                statusCode: 400,
                message: "Fields are required",
            });
            return res.status(response.statusCode).send(response);
        }

        // Check for required fields
        const requiredFields = ['name', 'description', 'price', 'category', 'brand', 'stock'];
        for (const field of requiredFields) {
            if (!body[field]) {
                const response = error_function({
                    success: false,
                    statusCode: 400,
                    message: `${field} is required.`,
                });
                return res.status(response.statusCode).send(response);
            }
        }

        // Process uploaded images if req.files is defined
        const images = (req.files['images[]'] || []).map(file => ({
            url: file.path, // Store the file path
            alt: req.body.altText || 'Product Image', // Optional alt text
        }));

        // Create a new product document with provided data and images
        const newProduct = new products({
            name: body.name,
            description: body.description,
            price: body.price,
            category: body.category,
            brand: body.brand,
            stock: body.stock,
            images, // Use processed images
        });

        // Save the product to the database
        const productDetails = await newProduct.save();

        const response = success_function({
            success: true,
            statusCode: 200,
            message: "Product added successfully",
            data: productDetails,
        });
        return res.status(response.statusCode).send(response);
        
    } catch (error) {
        console.error("Error adding product:", error);

        // Handle any errors during product creation
        const response = error_function({
            success: false,
            statusCode: 500, // Set to 500 for server error
            message: "Product adding failed, please try again.",
        });
        return res.status(response.statusCode).send(response);
    }
};
