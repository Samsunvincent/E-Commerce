const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User collection
            required: true,
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product', // Reference to the Product collection
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        orderDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;