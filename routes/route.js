const router= require('express').Router();
const jwt = require("jsonwebtoken");
const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env
const stripe = require('stripe')(STRIPE_SECRET_KEY);
const { Auth } = require('../middlewares/auth');
const Coach = require('../models/Coach');
const Player = require('../models/Player');

router.get('/', async(req,res) => {
    try{
        console.log(req.body)
        res.render("index",{ title: "Index", home: true})
    }catch (err) {
        console.log(err)
    }
});
//TODO: TO make a separate player dashboard and coach route
//router.get('/player')
router.get("/coach", Auth(), async(req,res) => {
  try{
      console.log(req.body)
        const players = await Player.find({coachEmail: req.body.user.email},{name:1,email:1, dueMonth:1, fees:1, feeStatus:1})
          res.render("dashboard",{ title: "Dashboard", user: req.body.user, players: players})
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
        const coach = await Coach.findOne({email: req.body.email}) 
        const player = await Player.findOne({email: req.body.email}) 
        let user = coach ? coach : player
        if(!user) res.render("error", { title: "error", message: "Coach not Found Signup first"})
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
        if(user.isCoach) {
          res.redirect("/coach")
        } else {
          res.render("index", {  
            title: "Player Dashboard", 
            home: false, 
            user: user })
        }
    }catch (err) {
        console.log(err)
    }
});

router.get('/signup-coach', async(req,res) => {
    try{
        console.log(req.body)
        res.render("signup-coach",{ title: "SignUp"})
    }catch (err) {
        console.log(err)
    }
});

router.post('/signup-coach', async(req,res) => {
        try{
            console.log(req.body)
            const user = await Coach.findOne({email: req.body.email})
            if(user) {
              res.render("error", { title: "error", message: "Coach already exist. Login Please"})
            } else {
              const newUser = { ...req.body }
              console.log(newUser.phone.length) //TODO: phone no check
            if(newUser.password!=newUser.confirmPassword && newUser.phone.length != 10) {
              res.render("error",{ title: "error" ,message: "Password doesnt match"})
            } else {
              const nUser = await Coach(newUser);
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
              res.redirect("/coach")
            
            }
            }
        }catch (err) {
            console.log(err)
        }
});

router.get('/signup-player', async(req,res) => {
  try{
      console.log(req.body)
      res.render("signup-player",{ title: "SignUp"})
  }catch (err) {
      console.log(err)
  }
});

router.post('/signup-player', async(req,res) => {
        try{
            console.log(req.body)
            const user = await Player.findOne({email: req.body.email})
            if(user) {
              res.render("error", { title: "error", message: "Player already exist. Login Please"})
            } else {
              //TODO: check if coach email exist then update coach players array const coach = await Coach.findOneAndUpdate({email: req.body.user.email},{ $push : {players: newUser.email}})
              const newUser = { ...req.body }
              console.log(newUser.phone.length) //TODO: phone no check
            if(newUser.password!=newUser.confirmPassword && newUser.phone.length != 10) {
              res.render("error",{ title: "error" ,message: "Password doesnt match"})
            } else {
              const nUser = await Player(newUser);
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
              console.log(userToken);
              res.cookie('userToken', userToken, {
                maxAge: 8640000,
                httpOnly: true,
              })
            
              res.render("index", { 
                title: "Player Dashboard", home: false, user: nUser
                })
            }
            }
        }catch (err) {
            console.log(err)
        }
});

router.get('/register-player', Auth(), async(req,res) => {
    try{
         res.render("register-player",{ title: "New Player Registration"})
    }catch (err) {
        console.log(err)
    }
});

router.post('/register-player', Auth(), async(req,res) => {
    try{
        console.log(req.body)
        const user = await Player.findOne({email: req.body.email})
            if(user) {
              res.render("error", { title: "error", message: "Player already exist. Login Please"})
            } else {
              const newUser = { ...req.body }
              console.log(newUser.phone.length) //TODO: phone no check
              newUser.password = newUser.email
              newUser.confirmPassword = newUser.email
              newUser.coachEmail = req.body.user.email
              const nUser = await Player(newUser);
              console.log(nUser)
              await nUser.save();
              const coach = await Coach.findOneAndUpdate({email: req.body.user.email},{ $push : {players: newUser.email}})
              res.redirect("/coach")
            }
    }catch (err) {
        console.log(err)
    }
});

router.get('/pay-fees', Auth(), async(req,res) => {
  try{
      console.log(req.body)
      const user = await Player.findOne({email: req.body.user.email})
      res.render("payment-page",{ 
        title: "Pay",
        user: user.name, 
        key: STRIPE_PUBLISHABLE_KEY,
        amount: user.fees || 500, 
        month: user.dueMonth || "October"})
  }catch (err) {
      console.log(err)
  }
});

router.post('/payment', Auth(), async(req,res) => {
  try{
      console.log(req.body)
      stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: req.body.user.name,
      }).then((customer) => {
          return stripe.charges.create({
            amount: req.body.amount,
            currency: "INR",
            customer: customer.id,
            description: req.body.fees,
          }).then((charge) => {
            res.redirect("/success")
          }).catch((err) => {
            res.redirect("/failure")
          })

      })
  }catch (err) {
      console.log(err)
  }
});

router.get('/success', Auth(), async(req,res) => {
  try{
      console.log(req.body)
      //alert("Your payment was succesful")
      const player = await Player.findOneAndUpdate({email:req.body.user.email},{feeStatus: "Paid"})
      res.render("index",{  title: "Player dashboard", home: false, user: req.body.user})
  }catch (err) {
      console.log(err)
  }
});

router.get('/failure', Auth(), async(req,res) => {
  try{
      console.log(req.body)
      //alert("Your payment was failed")
      //TODO: to remove the below code once payment intents api is integrated
      const player = await Player.findOneAndUpdate({email:req.body.user.email},{feeStatus: "Paid"})
      res.render("index",{  title: "Player dashboard", home: false, user: req.body.user})
  }catch (err) {
      console.log(err)
  }
});

router.get('/attendance', Auth(), async(req,res) => {
  try{
       res.render("attendance",{ title: "Attendance"})
  }catch (err) {
      console.log(err)
  }
});

router.post('/attendance', Auth(), async(req,res) => {
    try{
        console.log(req.body)
        res.render("attendance",{ title: "Attendance"})
    }catch (err) {
        console.log(err)
    }
});

module.exports = router;
