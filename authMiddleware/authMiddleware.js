//Get SECRET from .env
require('dotenv').config();
//Pull our SECRET from process.env
const {SECRET} = process.env;
//Bring in Json Web Token
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    //Check to see if user has proper authorization header: "bearer + <token>"
    if(req.headers.authorization){
      console.log('Hello From Auth Middleware');
      //Authorization header returns "bearer" + tokenString. The .split here is to separate the two into an array. We want the tokenString so we can compare it to our hashed password using our SECRET
      const token = req.headers.authorization.split(" ")[1];
      console.log(`Token: ${token}`); 
      //I believe payload is the returned result of comparing the token to the user's hashed password + SECRET, but I am waiting for a reply from Alex to confirm that
      const payload = await jwt.verify(token, SECRET);
      console.log(`Payload: ${payload}`);
      //If payload checks out then continue on with the code. If it doesn't send the correlating error message
      if(payload) {
        req.payload = payload;
        //Function that makes the middleware continue onto the next piece of code
        next();
      } else {
        res.status(400).json({error: "Access Denied: Verification Failed or No Payload"})
      }
    } else {
      res.status(400).json({error: "Access Denied: No Authorization Header"})
    }
  } catch {
    res.status(400).json({error: "Access Denied"})
  }
}

module.exports = auth;