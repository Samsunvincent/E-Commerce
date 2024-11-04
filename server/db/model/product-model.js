const mongoose = require('mongoose');

let product_Schema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        trim: true
    },
    description: {
        type: String,
        // required: true
    },
    price: {
        type: Number,
        // required: true,
        min: 0
    },
    category: {
        type: String,
        // required: true
    },
    brand: {
        type: String,
        // required: true
    },
    stock: {
        type: Number,
        // required: true,
        min: 0,
        default: 0
    },
    // images: [
    //     {
    //         url: { type: String, required: true },
    //         alt: { type: String }
    //     }
    // ],
});

module.exports = mongoose.model('product_data',product_Schema);