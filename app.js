const express = require('express');
const mustache = require('mustache');
const mustacheExpress = require('mustache-express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');

const Player = require("./models/player");

const DUPLICATE_RECORD_ERROR = 11000;


const mongoURL = 'mongodb://localhost:27017/player';
mongoose.connect(mongoURL, {useMongoClient: true});
mongo.Promise = require('bluebird');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.engine('mustache', mustacheExpress());
app.set('views', path.join(_dirname, 'views'));
app.set('view engine', 'mustache')
app.set('layout', 'layout');


app.use('/static', express.static('static'));


// put routes here

app.get('/new/', function (req, res) {
  res.render('new_player');
});


app.post('/new/', function (req, res) {
  Player.create(req.body)
  .then(function (player) {
    res.redirect('/');
  })
  .catch(function (error) {
    let errorMsg;
    if (error.code === DUPLICATE_RECORD_ERROR) {
      // make message about duplicate
      errorMsg = `The player name "${req.body.name}" has already been used.`
    } else {
      errorMsg = "You have encountered an unknown error."
    }
    res.render('new_player', {errorMsg: errorMsg});
  })
});

app.get('/:id/', function (req, res) {
  Player.findOne({_id: req.params.id}).then(function (player) {
    res.render("player", {player: player});
  })
})
