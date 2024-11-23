const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Assuming you have a User model to reference the user
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',  // Assuming you have a Product model to reference the products
            required: true
        },
        // quantity: {
        //     type: Number,
        //     // required: true,
        //     min: 1  // Minimum quantity should be 1
        // },
        price: {
            type: Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// cartSchema.pre('save', function (next) {
//     // Recalculate total price before saving
//     this.totalPrice = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
//     this.updatedAt = Date.now();
//     next();
// });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
