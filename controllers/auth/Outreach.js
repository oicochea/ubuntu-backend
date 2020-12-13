////////////////
//Dependencies
///////////////
require('dotenv').config();
const User = require('../../models/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Router} = require('express');
const router = Router();
const {SECRET} = process.env;

////////////
//Sign Up BC: localhost:4500/signup .... PM 4500/auth/signup
// "password": "$2b$10$kM8VET2RumNWm321EpAWheGp.0h/lruHskmy/veHdYt41JIDcMzMe",
///////////
router.post('/signup', async (req,res) => {
    try {
        //Salt the user's password so it is encrypted 
        req.body.password = await bcrypt.hash(req.body.password, 10);
        //Create the new user
        const newUser = await User.create(req.body);
        res.status(200).json(newUser);
    } catch (error) {
        res.status(400).json({error});
    }
});


////////////
//Log In: BC: localhost:4500/login
///////////
router.post('/login', async (req, res) => {
    try{
        const {username, password, zipCode} = req.body;
        console.log(req.body)
        const user = await User.findOne({username});
        if(user){
            const match = await bcrypt.compare(password, user.password);
            if(match) {
                //Token assigned to the username
                const token = await jwt.sign({username , zipCode}, SECRET);
                res.status(200).json({token});
            } else {
                res.status(400).json({error: "Password does not match."})
            }
        } else {
            res.status(400).json({error: "User not found."})
        }
    } catch(error){
        res.status(400).json({error})
    }
})

module.exports = router;


