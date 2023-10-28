const { Schema , Model, model}= require('mongoose');

const CoachSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isCoach: {
        type: Boolean,
        default: true,
    },
    password:{
        type: String,
        required: true
    },
    players: [],
    url: String,
},
{
    timestamps: true
});

const Coach = model('Coach', CoachSchema);

module.exports = Coach;

