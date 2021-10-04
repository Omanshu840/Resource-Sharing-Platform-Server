const jwt = require("jsonwebtoken");
const User = require('../models/user')
const {JWT_SECRET} = require('./config')
 
module.exports = function(req, res, next) {
    const {authorization} = req.headers

    if(!authorization) {
        return res.status(401).json({error: "you must be logged in"})
    }

    const token = authorization.replace("Bearer ", "")

    if (!token) return res.status(401).json({ error: "you must be logged in" });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // console.log(decoded.user.id)

        User.findById(decoded.user.id)
        .then((userData) => {
            req.user = userData
            next()
        })

        // req.user = decoded.user;
        // next();
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: "Invalid Token" });
  }
};