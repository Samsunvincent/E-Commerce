let user = require('../db/model/user-Model')
const { success_function, error_function } = require('../utils/Response-Handler')
let userType = require('../db/model/userType')
const bcrypt = require('bcrypt');

const category = require('../db/model/category');
const product = require('../db/model/product-model')
const addtocartmodel = require('../db/model/addtocart-Model');
const Cart = require('../db/model/addtocart-Model');
const order = require('../db/model/order-Model');





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
        return;
    }
}

exports.updateUserData = async function(req,res){
    let body = req.body;
    console.log("body",body);

    let userId = req.params.id;
    console.log("userId",userId);

    if(!body){
        let response = error_function({
            success : false,
            statusCode : 400,
            message : "body is not available",
        });
        return res.status(response.statusCode).send(response);

    }else{
        let updatingData = await user.findOne({ _id : userId});
        console.log("updating Data",updatingData);

        if(!updatingData){
            let response = error_function({
                success : false,
                statusCode : 400,
                message : "user not found",

            });
            return res.status(response.statusCode).send(response);
        }else{
            let updatedData = await user.updateOne({_id : userId},{$set : {name:body.name, email : body.email, phone : body.phone_number}});
            console.log("updated data",updatedData);

            if(updatedData){
                let response  = success_function({
                    success : true,
                    statusCode : 200,
                    message : "user updated succesfully",
                    data : updatedData
                });
                return res.status(response.statusCode).send(response);

            }else{
                let response = error_function({
                    success : false,
                    statusCode : 400,
                    message : "user updation failed",
                });
                return res.status(response.statusCode).send(response);
            }
           
        }
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

exports.addAddress = async function (req, res) {
    let id = req.params.id; // User ID from request parameters
    let newAddress = req.body.Address;
    console.log("new address",newAddress) // New address from the request body

    // Check if the Address field is addt
    if (!newAddress) {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "Address field is required",
        });
        res.status(response.statusCode).send(response);
        return;
    }

    try {
        // Add the new address to the user's Address array using $push
        let updateData = await user.updateOne(
            { _id: id },
            { $push: { Address: newAddress } } // Push the new address to the Address array
        );

        console.log("updateData", updateData);

        // Check if the update was successful
        if (updateData.matchedCount === 1 && updateData.modifiedCount === 1) {
            let response = success_function({
                success: true,
                statusCode: 200,
                message: "Address added successfully",
                data: updateData,
            });
           return res.status(response.statusCode).send(response);
        } else {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "Something went wrong, address was not added",
            });
            return res.status(response.statusCode).send(response);
        }
    } catch (error) {
        console.error("Error adding address:", error);

        let response = error_function({
            success: false,
            statusCode: 400,
            message: "Server error",
            error: error.message,
        });
        return res.status(response.statusCode).send(response);
    }
};



exports.filterCategory = async function(req, res) {
    // Validate the category in the request body
    const query_category = req.body.category;
    if (!query_category) {
        // Category is missing in the request body
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "Category is required."
        });
        return res.status(response.statusCode).send(response);
    }

    console.log("category", query_category);

    // Find the category in the database
    let categoryDoc;
    try {
        categoryDoc = await category.findOne({ category: query_category });
    } catch (error) {
        // If there's a database error
        let response = error_function({
            success: false,
            statusCode: 500,
            message: "Error occurred while querying the database."
        });
        return res.status(response.statusCode).send(response);
    }

    if (!categoryDoc) {
        // If the category doesn't exist
        let response = error_function({
            success: false,
            statusCode: 404,
            message: "Category not found."
        });
        return res.status(response.statusCode).send(response);
    }

    console.log("categoryDoc", categoryDoc);

    // Extract the category ID
    const c_id = categoryDoc._id;
    console.log("c_id", c_id);

    try {
        // Find the products in the specified category
        let productInCategory = await product.find({ category: c_id });

        console.log('productInCategory', productInCategory);

        if (productInCategory.length === 0) {
            // No products available in the category
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "No products available in this category."
            });
            return res.status(response.statusCode).send(response);
        } else {
            // Products found in the category
            let response = success_function({
                success: true,
                statusCode: 200,
                data: productInCategory
            });
            res.status(response.statusCode).send(response);
            return;
        }
    } catch (error) {
        // Handle any errors during the product query
        let response = error_function({
            success: false,
            statusCode: 500,
            message: "Error occurred while fetching products."
        });
        return res.status(response.statusCode).send(response);
    }
};

exports.addToCart = async function (req, res) {
    try {
        const { userId, productId, quantity, price } = req.body;

        // Validate input data
        if (!userId || !productId || !quantity || quantity <= 0 || !price) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "Invalid input data. Ensure userId, productId, quantity (>0), and price are provided."
            });
            return res.status(response.statusCode).send(response);
        }

        // Check if user exists
        const userExists = await user.findById(userId);
        if (!userExists) {
            let response = error_function({
                success: false,
                statusCode: 404,
                message: "User not found."
            });
            return res.status(response.statusCode).send(response);
        }

        // Check if product exists
        const productExists = await product.findById(productId);
        if (!productExists) {
            let response = error_function({
                success: false,
                statusCode: 404,
                message: "Product not found."
            });
            return res.status(response.statusCode).send(response);
        }

        // Retrieve the cart or create a new one if it doesn't exist
        let cart = await addtocartmodel.findOne({ userId });

        // Ensure no stale data is present after deletion
        if (!cart) {
            console.log("No existing cart found, creating a new cart.");
            cart = new addtocartmodel({ userId, items: [] });
        } else {
            console.log("Existing cart found:", cart);
        }

        // Check if the product is already in the cart
        const existingItem = cart.items.find(
            (item) => item.productId.toString() === productId
        );

        if (existingItem) {
            // Update quantity for the existing product
            existingItem.quantity += quantity;
            console.log(`Updated quantity for product ${productId}:`, existingItem.quantity);
        } else {
            // Add new product to the cart
            cart.items.push({ productId, quantity, price });
            console.log(`Added new product ${productId} to the cart.`);
        }

        // Save the updated cart
        await cart.save();

        // Populate product details for all cart items
        const cartWithProductDetails = await Promise.all(
            cart.items.map(async (item) => {
                const productDetail = await product.findById(item.productId).populate("sellerID");
                return {
                    ...item.toObject(), // Spread cart item properties
                    product: productDetail // Add product details
                };
            })
        );

        // Send the response with updated cart and full product details
        let response = success_function({
            success: true,
            statusCode: 200,
            message: "Added to cart successfully.",
            data: { cart, cartItemsWithProducts: cartWithProductDetails }
        });
        return res.status(response.statusCode).send(response);
    } catch (error) {
        console.error("Error in addToCart:", error);

        let response = error_function({
            success: false,
            statusCode: 500,
            message: "An error occurred while adding to the cart."
        });
        return res.status(response.statusCode).send(response);
    }
};


exports.getCartData = async function (req, res) {
    const id = req.params.id;

    // Check if user ID is provided
    if (!id) {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "User ID is missing",
        });
        return res.status(response.statusCode).send(response);
    }

    try {
        // Fetch cart data
        const cartData = await Cart.findOne({ userId: id });

        if (!cartData || cartData.items.length === 0) {
            // Return 200 for an empty cart
            let response = success_function({
                success: true,
                statusCode: 200,
                message: "Your cart is empty",
                data: [],
            });
            return res.status(response.statusCode).send(response);
        }

        // Extract product IDs and fetch product data
        const productIds = cartData.items.map((item) => item.productId);
        const productData = await product.find({ _id: { $in: productIds } });

        // Return the product data
        let response = success_function({
            success: true,
            statusCode: 200,
            message: "Products retrieved successfully",
            data: productData,
        });
        return res.status(response.statusCode).send(response);

    } catch (error) {
        console.error("Backend error:", error);
        let response = error_function({
            success: false,
            statusCode: 500,
            message: "An error occurred while fetching cart data",
        });
        return res.status(response.statusCode).send(response);
    }
};

exports.removeCartData = async function (req, res) {
    try {
        const { userId } = req.body; // Assuming user ID is passed in the request body
        const productId = req.params.id; // Product ID is passed as a URL parameter

        // Validate input
        if (!userId || !productId) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "User ID or Product ID is missing",
            });
            return res.status(response.statusCode).send(response);
        }

        // Find and update the cart by removing the product from the items array
        const updatedCart = await Cart.findOneAndUpdate(
            { userId }, // Match the user's cart
            { $pull: { items: { productId } } }, // Remove the product from items array
            { new: true } // Return the updated document
        );

        // If no cart or product is found
        if (!updatedCart || updatedCart.items.length === 0) {
            let response = error_function({
                success: false,
                statusCode: 404,
                message: "Product not found in the cart or cart is empty",
            });
            return res.status(response.statusCode).send(response);
        }

        // Success response
        let response = success_function({
            success: true,
            statusCode: 200,
            message: "Product removed successfully",
            data: updatedCart,
        });
        return res.status(response.statusCode).send(response);

    } catch (error) {
        console.error("Error removing cart data:", error);
        let response = error_function({
            success: false,
            statusCode: 500,
            message: "Internal Server Error",
        });
        return res.status(response.statusCode).send(response);
    }
};



exports.addOrder = async function (req, res) {
    try {
        let p_id = req.params.p_id;
        console.log("p_id from add order:", p_id);

        let userId = req.body.userId; // Ensure proper casing for "userId"
        console.log("userId:", userId);

        let { quantity, price } = req.body; // Assume these are sent in the request body

        // Validate required fields
        if (!p_id || !userId || !quantity || !price) {
            let response = {
                success: false,
                statusCode: 400,
                message: 'Missing required fields: productId, userId, quantity, or price',
            };
            return res.status(response.statusCode).send(response);
        }

        // Calculate total amount
        let totalAmount = quantity * price;

        // Create a new order
        const newOrder = new order({
            userId: userId,
            products: [
                {
                    productId: p_id,
                    quantity: quantity,
                    price: price,
                },
            ],
            totalAmount: totalAmount,
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();

        // Respond with success
        return res.status(201).send({
            success: true,
            statusCode: 201,
            message: 'Order created successfully',
            order: savedOrder,
        });
    } catch (error) {
        console.error('Error adding order:', error);
        return res.status(500).send({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
        });
    }
};








// exports.search = async function(req,res){
//    try {
//     let name = req.body.name;
//     console.log("name",name);

//     if(name){
//         let check_product_name = await product.findOne({name : name})
//         console.log("check_product_name",check_product_name);
//     }
//    } catch (error) {
//     console.log("error",error);
//    }


// }


