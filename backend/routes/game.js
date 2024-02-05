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

// This section will help you create a new record.
gameRoutes.route("/scores/add").post(function (req, response) {

    let db_connect = dbo.getDb();
   
    let myobj = {
      name: req.body.name,
      timeTaken: req.body.timeTaken,
      guesses: req.body.guesses,
      guessRange: req.body.guessRange,
    };
   
    db_connect.collection("scores").insertOne(myobj, function (err, res) {
      if (err) throw err;
      response.json(res);
      console.log("added record");
    });
});

gameRoutes.route("/scores").get(async function (req, response) {
    let db_connect = dbo.getDb();
    console.log("in beefpack");

    db_connect
        .collection("scores")
        .find({})
        .toArray()
        .then((data) => {
            response.json(data);
        });
  
});


module.exports = gameRoutes;