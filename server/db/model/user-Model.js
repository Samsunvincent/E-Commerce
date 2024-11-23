const mongoose = require('mongoose');

let user_Schema = new mongoose.Schema({
    name : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    phone_number : {
        type : String
    },
    Address : {

        street : {
            type : String
        },
        city : {
            type : String
        },
        country : { 
            type : String
        },
        state : { 
            type : String
        },
        pincode : {
            type : String
        }
    },
    userType : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "userType"
    }
})

let user = mongoose.model('user_data',user_Schema);
module.exports = user