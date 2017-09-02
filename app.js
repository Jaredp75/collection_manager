const express = require('express');
const mustache = require('mustache');
const mustacheExpress = require('mustache-express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const Player = require("./models/player");
const playerRouter = require("./routers/player");


const DUPLICATE_RECORD_ERROR = 11000;


const mongoURL = 'mongodb://localhost:27017/player';
mongoose.connect(mongoURL, {useMongoClient: true});
mongoose.Promise = require('bluebird');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.engine('mustache', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache')
app.set('layout', 'layout');


app.use('/static', express.static('static'));


// put routes here

app.get('/favicon.ico', function(req, res) {
  res.status(204);
})

app.get('/new/', function (req, res) {
  res.render('new_player', {player: player});
});


app.post('/new/', function (req, res) {
  Player.create(req.body).then(function (player) {
    res.redirect('/');
  }).catch(function(error) {
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

app.use('/:id', playerRouter);

app.get('/', function(req, res) {
  Player.find().then(function(players) {
    res.render('index', {player: player});
  })
})


//app.get('/:id/', function (req, res) {
//  Player.findOne({_id: req.params.id}).then(function (player) {
//    res.render("player", {players: player});
//  })
//})

//app.get('/:id/edit/', function (req, res) {
//  Recipe.findOne({_id: req.params.id}).then(function (recipe) {
//    res.render("edit_recipe", {recipe: recipe});
//  })
//})

//app.post("/:id/edit", function (req, res) {
//  Recipe.findOneAndUpdate({_id: req.params.id}, {
//    name: req.body.name,
//    source: req.body.source
//    prepTime: req.body.prepTime,
//    cookTime: req.body.cookTime
//  }).then(function)
//  })
//})




//app.get('/:id/new_player/', function (req, res) {
//  Player.findOne({_id: req.params.id}).then(function (player) {
//    res.render("new_player", {player: player});
//  })
//})

//app.post('/:id/new_age/', function (req, res) {
//  Player.findOne({_id: req.params.id}).then(function (player) {
//    player.ingredients.push(req.body);
//    player.save().then(function () {
//        res.render("new_age", {player: player});
//    })
//  })
//})

//app.get('/:id/new_team,/', function (req, res) {
//  Player.findOne({_id: req.params.id}).then(function (player) {
//    res.render("new_team", {player: player});
//  })
//})

//app.post('/:id/new_stats/', function (req, res) {
//  Player.findOne({_id: req.params.id}).then(function (player) {
//    player.stats.push(req.body.step);
//    player.save().then(function () {
//      res.render("new_stats", {player: player});
//    })
//  })
//})


//app.get('/', function (req, res) {
//  Player.find().then(function (player) {
//    res.render('index', {player: player});
//  })
//})

module.exports = app;
