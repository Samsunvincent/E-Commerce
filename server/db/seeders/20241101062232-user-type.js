// const userType = require('../model/userType');
// 'use strict';

// module.exports = {
//   up: (models, mongoose) => {
    
//       return models.userType.insertMany([

      
//         {
//           _id : "6724f980cd74efbc72c087c8",
//           userType : "Seller"
//         },
//         {
//           _id : "6724f994cd74efbc72c087c9",
//           userType : "Buyer"
//         }
        
//       ]).then(res => {
//       // Prints "1"
//       console.log("seeding successfull");
//       console.log(res.insertedCount);
//     });
    
//   },

//   down: (models, mongoose) => {
    
//       return models.userType.deleteMany({
//         _id : {
//           $in : [
            
//             "6724f980cd74efbc72c087c8",
//             "6724f994cd74efbc72c087c9"
//           ]
//         }
//       }).then(res => {
//       // Prints "1"
//       console.log("seeder rollback successfull");
//       console.log(res.deletedCount);
//       });
    
//   }
// };




const userType = require('../model/userType'); // Assuming this is the Mongoose model
'use strict';

module.exports = {
  up: async () => {
    try {
      const result = await userType.insertMany([
        {
          _id: "6724f980cd74efbc72c087c8",
          userType: "Seller"
        },
        {
          _id: "6724f994cd74efbc72c087c9",
          userType: "Buyer"
        }
      ]);
      console.log("Seeding successful");
      console.log(result.length); // Logs the number of inserted documents
    } catch (error) {
      console.error("Seeding failed:", error);
    }
  },

  down: async () => {
    try {
      const result = await userType.deleteMany({
        _id: {
          $in: [
            "6724f980cd74efbc72c087c8",
            "6724f994cd74efbc72c087c9"
          ]
        }
      });
      console.log("Seeder rollback successful");
      console.log(result.deletedCount); // Logs the number of deleted documents
    } catch (error) {
      console.error("Rollback failed:", error);
    }
  }
};
