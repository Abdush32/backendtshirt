const express = require("express")
const router = express.Router();



const {getUserById,getUser,updateUser,userPurchaseList} = require("../controllers/user")
const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth");
// const { Router } = require("express");

router.param("userId",getUserById); //userId is just a name
router.get("/user/:userId", isSignedIn,isAuthenticated,getUser); // if user wants name email so thats we are using middleware
// router.get("/users",getAllusers) // MY ROUTES TO GET ALL DATA {,getAllusers} WRITE THIS ON CONTROLLER/USER
router.put("/user/:userId", isSignedIn,isAuthenticated,updateUser); //THIS IS FOR UPDATE
router.get("/orders/user/:userId", isSignedIn,isAuthenticated,userPurchaseList); 
module.exports = router;


