const { Schema , Model, model}= require('mongoose');

const PlayerSchema = new Schema({
    coachEmail: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isCoach: {
        type: Boolean,
        default: false,
    },
    password:{
        type: String,
        required: true
    },
    fees: {
        type: Number,
        default: 500,
    },
    dueMonth: {
        type: String,
        default: "October"
    },
    feeStatus: {
        type:"String",
        default: "Not Paid"
    },
    url: String,
},
{
    timestamps: true
});

const Player = model('Player', PlayerSchema);

module.exports = Player;

