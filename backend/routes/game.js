const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const gameRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
// https://www.mongodb.com/community/forums/t/solved-mern-tutorial-issue-cannot-read-properties-of-undefined-reading-collection/212521/2
gameRoutes.route("/range").get(async function (req, response) {
    // let db_connect = dbo.getDb();
    // console.log("in beefpack");
    let topnumber = Math.floor(Math.random() * 101) * 10;
    // console.log("number is: ", num);
    response.json({range: [0, topnumber]});
    // db_connect
    //     .collection("records")
    //     .find({})
    //     .toArray()
    //     .then((data) => {
    //         response.json(data);
    //     });
  
});

module.exports = gameRoutes;