/* global use, db */
// Select the database to use.
use('labelDb');

// Insert a few documents into the users collection.
/* db.getCollection('users').insertMany([
  {
    "deletionDate": null,
    "email": "testmongo.scrutator@label.fr",
    "hashedPassword": "$2a$10$yArPJqTdRjQso0XApnQyReXRNNqH4kEOvhrqGuIDxOaMWlwWVGfOi",
    "isActivated": true,
    "passwordLastUpdateDate": 1702997664878,
    "name": "Test Scrutator mongo",
    "role": "scrutator"
  },
]); */

// get collection
// db.getCollection("users").find();

// An aggregation exemple results.
// db.getCollection('users').aggregate([
//   // Find all users create in 2023.
//   { $match: { date: { $gte: new Date('2014-01-01'), $lt: new Date('2015-01-01') } } },
//   // Group the total users by role.
//   { $group: { _id: '$item', TotalUsers: { $sum: { $multiply: ['$price', '$quantity'] } } } }
// ]);

//mongodb://localhost:55431/?readPreference=primary&ssl=false&directConnection=true
// db.documents.find();
// db.decisions.aggregate(
//   [
//     { $match: { sourceName: 'juritj' } },
//     {
//       $group: {
//         _id: '$labelStatus',
//         count: { $sum: 1 }
//       }
//     }
//   ]
// )


// Search for documents in the current collection.
// db.documents.find(ObjectId("6593e1c806c9d6002a063c1a"))
