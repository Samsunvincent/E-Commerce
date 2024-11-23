const mongoose = require('mongoose')

const user_Type_Schema = new mongoose.Schema({
    userType : {
        type : String
    }
});
module.exports = mongoose.model('userType',user_Type_Schema);