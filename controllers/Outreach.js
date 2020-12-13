const Outreach = require("../models/outreach.js")
const User = require("../models/auth");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Router } = require("express");
const router = Router();
const auth = require('../authMiddleware/authMiddleware')
const authRouter = require('./auth/Outreach')
const {SECRET} = process.env;

// BC: Backend Routes: localhost4500
// BC: Frontend Routes: localhost:3000


//index route: BC: localhost:4500
router.get("/", async (req, res) => {
    console.log('Hello Site Landing Page')
    res.json(await Outreach.find({}))
});


///////////////////
//User Homepage  localhost:4500/auth/userHomepage 
//////////////////

// router.get('/auth/userHomepage', auth,  async (req, res) => {
//   try {
//     console.log('Hello from User Homepage. You need to be logged in')
//     console.log(`Req.Payload: ${payload}`)
//     const {username, zipCode } = req.payload
//     res.status(200).json(await Outreach.find({ zipCode }))
//   } catch(error){
//     console.log(error)
//   }
  
// })

/////////////
//BC: Signup localhost:4500/signup
/////////////
router.post('/auth/signup', async (req,res) => {
  console.log('Welcome to the signup page')
  //res.send('Hello from sign up page')
  try {
      //Salt the user's password so it is encrypted 
      req.body.password = await bcrypt.hash(req.body.password, 10);
      //Create the new user
      const newUser = await User.create(req.body);
      //If everything goes well we get a new user. If not 400 error
      res.status(200).json(newUser);
  } catch (error) {
      res.status(400).json({error});
  }
});


////////////
//Log In: BC: localhost:4500/login
///////////
router.post('/auth/login', async (req, res) => {
  console.log('Hello from Log in page')
  //res.send('Hello from login page')
  try{
      const {username, password, zipCode} = req.body;
      const user = await User.findOne({username});
      if(user){
          const match = await bcrypt.compare(password, user.password);
          if(match) {
              //Token assigned to the username
              const token = await jwt.sign({zipCode}, SECRET);
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


/////////////
//CREATE
////////////
router.post("/", async (req, res) => {
  res.json(await Outreach.create(req.body));
});


/////////////
//UPDATE
////////////
router.put("/:id", async (req, res) => {
  res.json(await Outreach.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

/////////////
//DELETE
////////////
router.delete("/:id", async (req, res) => {
  res.json(await Outreach.findByIdAndRemove(req.params.id));
});

//Profile populate by zip code
// router.get("/profile/:zipCode" , auth, async (req, res) => {
//   try{
//     req.body.username = req.session.username
//     zipCode = req.params.zipCode
//     const outreach = await Outreach.find({zipCode: req.params.zipCode})
//     res.render("profile/profilePage.jsx",{outreach})//or whatever we deccide to call it 
//   }  catch(error){
//     console.log(error)
//   }

// });


// EXPORT ROUTER
module.exports = router;
