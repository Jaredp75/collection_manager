const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    age: Number,
    team: String,
    stats: [{
        RPG: { type: Number, required: true },
        PPG: { type: Number, required: true },
        APG: { type: Number, required: true }
    }],
    jerseyNumber: Number,
})

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;


//var player = new Player({name: "Andre Iguodala"});
//console.log(player.toObject());
//player.save();
