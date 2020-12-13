const {Schema, model} = require('mongoose');

//User Auth Schema
const authSchema = new Schema (
  {
    username: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    zipCode: {type:String}
},
  {timestamps:true}
);

const User = model('auth', authSchema);

module.exports = User