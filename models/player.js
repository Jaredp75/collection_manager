const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    age: Number,
    team: String,
    stats: [
      {
        RPG: {
          type: Number,
          required: true
        },
        PPG: {
           type: Number,
           required: true
         },
        APG: {
           type: Number,
           required: true
         }
    }],
    jerseyNumber: Number,
})


playerSchema.methods.findPlayersFromSameTeam = function(callback) {
    return this.model('Player').find({
        source: this.team,
        _id: {
            $ne: this._id
        }
    }, callback);
}

playerSchema.methods.getFormData = function() {
    const error = this.validateSync();
    let errors;
    if (error) {
        errors = error.errors;
    } else {
        errors = {};
    }

    const fields = [
        {
            name: 'name',
            label: 'Name'
        }, {
            name: 'age',
            label: 'age'
        }, {
            name: 'team',
            label: 'team'
        }, {
            name: 'jerseyNumber',
            label: 'jerseyNumber'
        }
    ]

    fields.forEach(function(field) {
        field.value = this[field.name];
        field.error = errors[field.name];
    }.bind(this));

    let stats = {
      name: 'stats',
      label: 'stats',
      nested: []
    };

    for (let idx = 0; idx < this.stats.length; idx++) {
      stats.nested[idx] = [
        {
          nestedname: 'rpg',
          nestedlabel: 'RPG',
          index: idx,
          value: this.stats[idx].rpg,
          error: errors[`stats.${idx}.rpg`]
        },
        {
          nestedname: 'ppg',
          nestedlabel: 'PPG',
          index: idx,
          value: this.stats[idx].ppg,
          error: errors[`stats.${idx}.ppg`]
        },
        {
          nestedname: 'apg',
          nestedlabel: 'APG',
          index: idx,
          value: this.stats[idx].apg,
          error: errors[`stats.${idx}.apg`]
        }
      ]
    }

    fields.push(stats);

    return fields;
}




const Player = mongoose.model('Player', playerSchema);

module.exports = Player;


//var player = new Player({name: "Andre Iguodala"});
//console.log(player.toObject());
//player.save();
