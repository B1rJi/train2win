const { Schema , Model, model}= require('mongoose');

const UserSchema = new Schema({
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
    password:{
        type: String,
        required: true
    },
    url: String,
},
{
    timestamps: true
});

const User = model('User', UserSchema);

module.exports = User;

