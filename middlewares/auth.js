const jwt = require("jsonwebtoken");
const User = require("../models/User");


const Auth = (isAdmin = false) => {
    return async (req, res, next) => {
        try {
            let cookies = req.headers.cookie.split('; ');
            let token;
            for(let i =0; i<cookies.length; i++){
                let singleCookie = cookies[i].split('=');
                if(singleCookie[0] === 'userToken'){
                    token = singleCookie[1];
                } 
            }
            if (!token)
                res.render("error", { title: "error" ,message: "Cookie Not Found"})
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET)
            if (!decoded)
                res.render("error", { title: "error" ,message: "Cookie Not Found"})

            const user = await User.findById(decoded.user.id) 
            if (!user)
                res.render("error", { title: "error" ,message: "User Not Found"})
            req.body.user = user;

            if (user.isBanned || (isAdmin && !user.isAdmin)) {
                res.render("error", { title: "error" ,message: "Unauthorized. Contact Admin."})
            }

            next();
        } catch (err) {
            res.send({
                message: "500! Server error"
            });
        }
    };
};

module.exports = {
    Auth,
}