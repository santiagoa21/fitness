//Receive data from JSON POST and insert into MongoDB

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
var db;

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

//app.use(bodyParser.json())
app.use(express.json());


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