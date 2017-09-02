const express = require('express');
const Recipe = require("../models/player");

const router = express.Router({mergeParams: true});

const addIndexToStats = function(player) {
    for (let idx = 0; idx < player.stats.length; idx++) {
        player.stats[idx].index = idx;
    }
}

const getPlayer = function(req, res, next) {
    Player.findOne({_id: req.params.id}).then(function(recipe) {
        req.player = player;
        next();
    })
}

router.use(getPlayer);

router.get('/', function(req, res) {
    const recipe = req.recipe;
    recipe.findPlayersFromSameTeam().then(function(otherPlayers) {
        res.render("player", {
            player: player,
            playersFromSameTeam: otherPlayers
        });
    })
})

router.get('/edit/', function(req, res) {
    const recipe = req.recipe;
    console.log(JSON.stringify(player.getFormData()));
    addIndexToStats(player);
    res.render("edit_player", {
        player: player,
        fields: player.getFormData(),
        nextIngIndex: player.stats.length
    });
})

router.post("/edit/", function(req, res) {
    const player = req.player;
    player.name = req.body.name;
    player.age = req.body.age;
    player.team = req.body.team;
    player.jerseyNumber = req.body.jerseyNumber;

    const stats = (req.body.stats || []).filter(function(stat) {
        return (stat.rpg || stat.ppg || stat.apg)
    });

    player.stats = stats;

    const error = player.validateSync();

    if (error) {
        addIndexToStats(player);
        console.log(error.errors);
        res.render("edit_player", {
            player: player,
            fields: player.getFormData(),
            nextIngIndex: player.stats.length,
            errors: error.errors
        });
    } else {
        player.save();
        res.redirect(`/${player._id}/`);
    }
})

router.get('/new_stat/', function(req, res) {
    res.render("new_stat", {player: req.player});
})

router.post('/new_stat/', function(req, res) {
    const player = req.player;
    player.stats.push(req.body);
    player.save().then(function() {
        res.render("new_stat", {player: player});
    })
})

router.get('/new_team/', function(req, res) {
    res.render("new_team", {player: req.player});
})

router.post('/new_team/', function(req, res) {
    player.team.push(req.body.team);
    player.save().then(function() {
        res.render("new_team", {player: player});
    })
})

module.exports = router;
