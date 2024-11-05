

const category = require("../model/category");

module.exports = {
  up: (models, mongoose) => {

      return models.category.insertMany([
        {
         _id : "672a51cc117920b4fab31a98",
         category : "Electronics"
        },
        {
          _id : "672a51d8117920b4fab31a99",
          category: "Pet Supplies"
        },
        {
          _id : "672a51f4117920b4fab31a9a",
          category: "Food & Beverage"
        },
        {
          _id : "672a5203117920b4fab31a9b",
          category: "Books & Stationery"
        },
        {
          _id : "672a5213117920b4fab31a9c",
          category: "Toys & Games"
        },
        {
          _id : "672a5238117920b4fab31a9d",
          category: "Sports & Outdoors"
        },
        {
          _id : "672a5266117920b4fab31a9e",
          category: "Health & Beauty"
        },
        {
          _id : "672a5274117920b4fab31a9f",
          category: "Home & Living"
        },
        {
          _id : "672a527f117920b4fab31aa0",
          category: "Fashion"
        },
        {
          _id : "672a61f35151f95504b0b654",
          category: "Others"
        },
        
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
    
  },

  down: (models, mongoose) => {
    
   
      return models.category.deleteMany({
        _id : {
          $in : [
            "672a51cc117920b4fab31a98",
            "672a51d8117920b4fab31a99",
            "672a51f4117920b4fab31a9a",
            "672a5203117920b4fab31a9b",
            "672a5213117920b4fab31a9c",
            "672a5238117920b4fab31a9d",
            "672a5266117920b4fab31a9e",
            "672a5274117920b4fab31a9f",
            "672a527f117920b4fab31aa0",
            "672a61f35151f95504b0b654"


          ]
        }
      }).then(res => {
      // Prints "1"
      console.log("seeder rollback successfull")
      console.log(res.deletedCount);
      });
    
  }
};
