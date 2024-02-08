const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const gameRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

let playerState = {}

// https://www.mongodb.com/community/forums/t/solved-mern-tutorial-issue-cannot-read-properties-of-undefined-reading-collection/212521/2
gameRoutes.route("/range").post(async function (req, response) {
    const name = req.body.name;

    if (!playerState[name]) { // if player doesn't exist, make it exist
        playerState[name] = {};
    }

    const topnumber = Math.floor(Math.random() * 101) * 10;
    const range = [0, topnumber]
    const target = Math.floor(Math.random() * range[1]);

    console.log("name: " + name);
    console.log("range: " + range[0] + "-" + range[1]);
    console.log("targ: " + target + "\n");
    playerState[name].range = range;
    playerState[name].target = target;
    playerState[name].guesses = 0;

    response.json({range: range});  
});

function PostScore(myobj) {
    let db_connect = dbo.getDb();
    db_connect.collection("scores").insertOne(myobj, function (err, res) {
    if (err) throw err;
        response.json(res);
        console.log("added record");
    });
}

gameRoutes.route("/guess").post(async function (req, response) {
    const name = req.body.name;
    playerState[name].guesses += 1;

    if(parseInt(playerState[name].guesses) === 1) {
        playerState[name].startTime = new Date();
        console.log("setting time: " + playerState[name].startTime)
    }

    const guess = req.body.guess;
    const targetNum = playerState[name].target;

    let msgStr = "";
    let win = false;
    let gameData = {};    

    if (guess > targetNum) {
        msgStr = "lower than " + guess;
    } else if (guess < targetNum) {
        msgStr = "higher than " + guess;
    } else if (parseInt(guess) === targetNum) {
        msgStr = "correct! " + guess + " " + targetNum;
        win = true;

        let myobj = {
            name: name,
            timeTaken: (new Date() -  playerState[name].startTime) / 1000,
            guesses: playerState[name].guesses,
            guessRange: playerState[name].range,
        };

	    PostScore(myobj);
        gameData = myobj;
        playerState[name] = {}; // reset player

    } else {
        msgStr = "errr";
    }
    
    console.log("msgStr: ", msgStr);
    console.log("win: ", win);
    response.json({message: msgStr, winner: win, gameData: gameData});
});

gameRoutes.route("/scores").get(async function (req, response) {
    let db_connect = dbo.getDb();
    console.log("sending scores...\n");

    db_connect
        .collection("scores")
        .find({})
        .toArray()
        .then((data) => {
            response.json(data);
        });
  
});

// This section will help you delete a record
gameRoutes.route("/:id").delete(async (req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: new ObjectId(req.params.id) };
  
    db_connect
        .collection("scores")
        .deleteOne(myquery)
        .then((obj, err) => {
            if (err) throw err;
            console.log("1 document deleted");
            response.json(obj);
        });
});

module.exports = gameRoutes;
