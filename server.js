const express = require('express')
const app = express();

const mongoose = require('mongoose');
const YoutubeDataModel = require('./models/YoutubeData');

require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

const PORT= process.env.PORT || 3000
app.use("/", require('./routes/route'))

const connect = mongoose.connect(
    process.env.MONGO_URI,
    {},
    (err) => {
        if (err) console.log(err);
        else console.log("DB connection successful");
    }

)
app.listen(PORT, (err)=> {
    connect;
    if(err) console.log(err);
    else console.log("Running at port", PORT)
})