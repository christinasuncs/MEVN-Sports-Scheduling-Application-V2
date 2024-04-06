const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    campus: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Campus"
    },
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;