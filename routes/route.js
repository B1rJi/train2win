const router= require('express').Router();
const { Auth } = require('../middlewares/auth');
const User = require('../models/User');
const jwt = require("jsonwebtoken");
//const controller = require('../controllers/controller'); 

router.get('/', async(req,res) => {
    try{
        console.log(req.body)
        res.render("index",{ title: "Index"})
    }catch (err) {
        console.log(err)
    }
});

router.get('/login', async(req,res) => {
    try{
        console.log(req.body)
        res.render("login",{ title: "Login"})
    }catch (err) {
        console.log(err)
    }
});

router.post('/login', async(req,res) => {
    try{
        console.log(req.body)
        const user = await User.findOne({email: req.body.email})
        if(!user) res.render("error", { title: "error", message: "User not Found Signup first"})
        const userToken = jwt.sign(
            {
              user: {
                id: user._id,
              },
            },
            process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_EXPIRY,
            }
          );
          console.log(userToken);
          res.cookie('userToken', userToken, {
            maxAge: 8640000,
            httpOnly: true,
          })
        if(user.isAdmin) res.render("dashboard",{ title: "Dashboard", user: user.name})
        res.render("index", { title: "Home"})
    }catch (err) {
        console.log(err)
    }
});

router.get('/signup', async(req,res) => {
    try{
        console.log(req.body)
        res.render("signup",{ title: "SignUp"})
    }catch (err) {
        console.log(err)
    }
});

router.post('/signup', async(req,res) => {
        try{
            console.log(req.body)
            const user = await User.findOne({email: req.body.email})
            if(user) res.render("error", { title: "error", message: "User already exist. Login Please"})
            const newUser = { ...req.body }
            const nUser = await User(newUser);
            console.log(nUser)
            await nUser.save();
            const userToken = jwt.sign(
                {
                  user: {
                    id: nUser._id,
                  },
                },
                process.env.JWT_SECRET,
                {
                  expiresIn: process.env.JWT_EXPIRY,
                }
              );
            //   const refToken = jwt.sign(
            //     {
            //       user: {
            //         id: user._id,
            //       },
            //     },
            //     process.env.REFRESH_JWT_SECRET,
            //     {
            //       expiresIn: process.env.REFRESH_JWT_EXPIRY,
            //     }
            //   );
              console.log(userToken);
              res.cookie('userToken', userToken, {
                maxAge: 8640000,
                httpOnly: true,
              })
            //if(user.isAdmin) res.render("dashboard",{ title: "Dashboard"})
            res.render("index", { title: "Home"})
        }catch (err) {
            console.log(err)
        }
});

router.get('/attendance', Auth(), async(req,res) => {
    try{
         res.render("attendance",{ title: "SignUp"})
    }catch (err) {
        console.log(err)
    }
})

router.post('/attendance', Auth(), async(req,res) => {
    try{
        console.log(req.body)
        res.render("attendance",{ title: "SignUp"})
    }catch (err) {
        console.log(err)
    }
});

module.exports = router;
