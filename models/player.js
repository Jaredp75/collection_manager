const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    age: Number,
    team: String,
    jerseyNumber: Number,
    stats: [{
        rpg: Number,
        ppg: Number,
        apg: Number,
    }]
});





const Player = mongoose.model('Player', playerSchema);

module.exports = Player;


//var player = new Player({name: "Andre Iguodala"});
//console.log(player.toObject());
//player.save();
