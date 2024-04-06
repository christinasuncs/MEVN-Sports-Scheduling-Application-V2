const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leagueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    teams: [{
        type: Schema.Types.ObjectId,
        ref: "Team"
    }]
});

const League = mongoose.model('League', leagueSchema);

module.exports = League;