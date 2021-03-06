const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const { token } = require("morgan");



exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg // very first msg is getting error
    });
  }

  
  const user = new User(req.body);
  user.save((err, user) => { 
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB"
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id
    });
  });
};

exports.signin = (req,res) =>{
  const { email, password} = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

User.findOne({email}, (err,user) =>{ //it find very first email frm DB

if(err || !user){
 return  res.status(400).json({
    error:"USER email does not exit"
  })
}


if(!user. authenticate(password)){
return res.status(401).json({
  error: "Email do not matched"
})
}


//CREATE TOKENS HERE

const token = jwt.sign({
  _id: user._id},
  process.env.SECRET)

  //PUT TOKENS IN COOKIE
  res.cookie("token", token, {expire: new Date() + 999}); 

  //SEND RESPONSE TO FRONT-END
  const {_id, name, email, role} = user;
  return res.json({token, user: {_id,name,email,role}})


})

}

//SIGNOUT
exports.signout = (req, res) => {
res.clearCookie("token")
  res.json({
    message: "User signout sucessfully"
  });
};



//PROCTED ROUTES
exports.isSignedIn = expressJwt({

  secret: process.env.SECRET,
  userProperty:"auth"
})


// CUSTOM MIDDLEWARE

exports.isAuthenticated = (req,res,next) =>{
let checker = req.profile && req.auth && req.profile._id ==  req.auth._id;
if(!checker){
  return res.status(403).json({
    error:"ACCESS DENIED"
  })
}

  next();
}

exports.isAdmin = (req,res,next) =>{
   if(req.profile.role === 0){
    return res.status(403).json({
      error:"YOU ARE NOT ADMIN Acess Denied"
    })
  }
  
    next();
  }
  

