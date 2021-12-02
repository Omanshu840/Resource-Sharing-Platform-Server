const Router = require('express').Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require('../models/user');
const auth = require('../utils/auth');
const { JWT_SECRET } = require('../utils/config');


Router.post('/signup', async (request, response) => {
    const {firstname, lastname, username, email, password} = request.body;

    try {
        let user = await User.findOne({email});

        if(user) {
            return response.status(422).json({
                error: "User already exists"
            })
        }

        user = new User({
            firstname,
            lastname,
            username,
            email,
            password,
        })

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            JWT_SECRET, {
                expiresIn: 100000
            },
            (err, token) => {
                if (err) throw err;
                response.status(200).json({
                    token
                });
            }
        );
    } catch (err) {
        console.log(err.message);
        response.status(500).json( {
            error: "Error in Saving"
        });
    }
})


Router.post('/login', async (request, response) => {
    const {email, password} = request.body;

    try {
        let user = await User.findOne({email});

        if(!user)   {
            return response.status(400).json({error: "Incorrect User credentials"})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return response.status(400).json({error: "Incorrect User credentials"})
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            JWT_SECRET,
            {
                expiresIn: 100000
            },
            (err, token) => {
                if(err) throw err;

                response.status(200).json({
                    user,
                    token
                });
            }
        );
    } catch (e) {
        console.error(e);
        response.status(500).json({
            error: "Server Error"
        });
    }
})


Router.get('/user', auth, async (request, response) => {
    try {
        const user = await User.findById(request.user._id);
        response.status(200).json({
            user
        });
    } catch(e) {
        response.status(500).json({
            error: "Error in Fetching user"
        })
    }
})


Router.put('/update-profile', auth, async (request, response) => {
    try {
        const user = await User.findById(request.user._id);

        if(request.body.name) user.name = request.body.name;
        if(request.body.display_name) user.display_name = request.body.display_name;
        if(request.body.mobile_number) user.mobile_number = request.body.mobile_number;
        if(request.body.email) user.email = request.body.email;
        if(request.body.password) {
            user.password = request.body.password;
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        if(request.body.area_code) user.area_code = request.body.area_code;

        user.save()
        .then((user) => {
            response.json(user)
        })
        .catch((err) => {
            console.log(err)
        })
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
})


Router.get('/users/:userId', async (request, response) => {
    User.findOne({_id:request.params.userId})
    .select("-password")
    .then(user=>{
        response.json(user)
    })
    .catch(err=>{
        return response.status(404).json({error:"User not found"})
    })
})

module.exports = Router