///////////////////////////
// Environmental Variables
///////////////////////////
require("dotenv").config();

/////////////////////////////////////
// MONGOOSE CONNECTION
/////////////////////////////////////

//I need to change this to Oscar's URI
const { MONGODBURI } = process.env;
const mongoose = require("mongoose");
const config = { useUnifiedTopology: true, useNewUrlParser: true };
const DB = mongoose.connection;

//////////////////////
//Connect to Mongo
/////////////////////

//Change to Oscar's URI
mongoose.connect(MONGODBURI, config);

/////////////////////////////
//Mongo Connection Events
////////////////////////////
DB.on("open", () => console.log("You are connected to Mongo"))
  .on("close", () => console.log("You are disconnected to Mongo"))
  .on("error", (err) => console.log(err));



  
module.exports = mongoose;
