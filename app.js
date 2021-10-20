/**
 * Armando Santiago
 * Google Fit API 
 * V1
 * 
 */

const express = require("express");
const app = express();
const port = 8080;
const { google } = require("googleapis");
const request = require("request");
const cors = require('cors');
const urlParse = require("url-parse");
const queryParse = require('query-string');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient
var db;
var router = express.Router();
var assert = require('assert');
var url = 'mongodb+srv://mando:Diamond1@cluster0.tdv4k.mongodb.net/Fitness';


/*
router.get('/', function(req, res, next) {
    res.render('index');
});
router.get('/get-data', function(req, res, next) {

});
/*
router.post('/insert', function(req, res, next) {
            var item = {
                id: req.body.id,
                activity: req.body.activity,
                step: req.body.step
            }
          /*  mongoose.mongo.connect(url, function(err, db) {
                assert.equal(null, err);
                db.collection('activities').insertOne(item, function(err, result) {
                        console.log("Item inserted");
                        db.close();
                    }
              //  };
            });
          /*  router.post('/update', function(req, res, next) {

            });
            router.post('/delete', function(req, res, next) {

            });*/

//273042711119-0v7ad5ktlkdokpivuvn77a1dnjpbhd92.apps.googleusercontent.com
// IMaCCvy4dTQ9ibguN-Rn5-Ou
// api key AIzaSyC3LgHHS6KUxcy3XTsgiwf6gecfD_3sYd4

//var url = "mongodb://localhost:27017/";
/*
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Fitness");
    var myobj = [
        { activity: 'Steps', count: 3631 },
        { activity: 'Steps', count: 5239 },
        { activity: 'Steps', count: 965 },
        { activity: 'Steps', count: 4805 },
        { activity: 'Steps', count: 1624 },
        { activity: 'Steps', count: 3574 },
        { activity: 'Steps', count: 1958 },
        { activity: 'Steps', count: 5060 },
        { activity: 'Steps', count: 925 },
        { activity: 'Steps', count: 328 },
    ];
    dbo.collection("activities").insertMany(myobj, function(err, res) {
        //dbo.collection('activities').insertOne(req.body, function(err, result) {
        if (err) throw err;
        console.log("New documents inserted " + res.insertedCount);
        db.close();
    });
});
*/

mongoose.connect('mongodb+srv://mando:Diamond1@cluster0.tdv4k.mongodb.net/Fitness', { useNewUrlParser: true }, { useUnifiedTopology: true });

//Establish Connection
MongoClient.connect('mongodb+srv://mando:Diamond1@cluster0.tdv4k.mongodb.net/Fitness', function(err, database) {
    if (err)
        throw err
    else {
        db = database;
        console.log('You Have Successfully Connected to MongoDB');
        //Start app only after connection is ready
        app.listen(3000);
    }
});

app.use(express.json());
//app.use(bodyParser.json()) //deprecated


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/', function(req, res) {
    // Insert JSON straight into MongoDB
    db.collection('activities').insert(req.body, function(err, result) {
        if (err)
            res.send('Error');
        else
            res.send('Success');

    });
});

/*
const connectToMongoDB = async() => {
    await mongo().then(async(mongoose) => {
        try {
            console.log('You have connected to MongoDB!')

            const activity = {
                id: 1,
                activity: 'STEPS',
                count: 325

            }
            await new activitySchema(activity).save()
        } finally {
            mongoose.connection.close()
        }
    })
}
*/
app.use(cors())
app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.get("/getURLTing", (req, res) => {
    const oauth2Client = new google.auth.OAuth2(
        //client id
        "273042711119-0v7ad5ktlkdokpivuvn77a1dnjpbhd92.apps.googleusercontent.com",

        //client secret 
        "IMaCCvy4dTQ9ibguN-Rn5-Ou",

        //redirect to
        "http://localhost:8080/steps"

    );

    const scopes = ["https://www.googleapis.com/auth/fitness.activity.read profile email openid"];

    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        state: JSON.stringify({
            callbackUrl: req.body.callbackUrl,
            userID: req.body.userid
        })
    });

    request(url, (err, response, body) => {
        console.log("error ", err);
        console.log("statusCode: ", response && response.statusCode);
        res.send({ url });
    });
});

app.get("/steps", async(req, res) => {
    const queryURL = new urlParse(req.url);
    const code = queryParse.parse(queryURL.query).code;

    const oauth2Client = new google.auth.OAuth2(
        //client id
        "273042711119-0v7ad5ktlkdokpivuvn77a1dnjpbhd92.apps.googleusercontent.com",

        //client secret 
        "IMaCCvy4dTQ9ibguN-Rn5-Ou",

        //redirect to
        "http://localhost:8080/steps"

    );
    const tokens = await oauth2Client.getToken(code);

    //console.log(tokens);
    res.send("Hello Fitness Junkie and welcome to your new fitness app!");
    //console.log(code);

    let stepArray = [];

    try {
        const result = await axios({
            method: "POST",
            headers: {
                authorization: "Bearer " + tokens.tokens.access_token
            },
            "Content-Type": "application/json",
            url: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
            data: {
                aggregateBy: [{
                    dataTypeName: "com.google.step_count.delta",
                    dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
                }],
                bucketByTime: { durationMillis: 86400000 },
                startTimeMillis: 1633060800000, //oct 1 
                endTimeMillis: 1633924800000 // oct 9 //1633665600000 //oct 7        //1633233600000 // oct 2
            },
        });
        //console.log(result);
        stepArray = result.data.bucket
            //stepArray = result.data.err

    } catch (e) {
        console.log(e);
    }
    try {
        for (const dataSet of stepArray) {
            //console.log(dataSet);
            for (const points of dataSet.dataset) {
                //  console.log(points);
                for (const steps of points.point) {
                    console.log(steps.value);
                    MongoClient.connect(url, function(err, db) {
                        if (err) throw err;
                        var dbo = db.db("Fitness");
                        var myobj = [{
                            activity: 'Steps',
                            count: steps.value
                        }, ];
                        dbo.collection("activities").insertMany(myobj, function(err, res) {
                            //dbo.collection('activities').insertOne(req.body, function(err, result) {
                            if (err) throw err;
                            console.log("New documents inserted " + res.insertedCount);
                            db.close();
                        });
                    });
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
});

app.listen(port, () => console.log('Google Fit is listening on PORT 8080'));