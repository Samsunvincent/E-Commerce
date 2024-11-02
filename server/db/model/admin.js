const mongoose = require('mongoose')


const adminSchema = new mongoose.Schema({
   name : {
    type : String
   },
   email : {
    type : String
   },
   password : {
    type : String
   },
   userType : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "userType"
}
})
module.exports = mongoose.model('admin_data',adminSchema);