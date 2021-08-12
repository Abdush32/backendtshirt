const express = require("express")
const router = express.Router()

const 
{getCategoryById,createCategory,getCategory,getAllCategory,updateCategory,removeCategory} = require("../controllers/category")

const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")// we will extract more information



//PARAMS
router.param("userId",getUserById); 
router.param("categoryId",getCategoryById);

//actual routers goes here
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory)

//read
// EVERY SINGLE CATEGORY
router.get("/category/:categoryId", getCategory)// It is grabbing one category itself
//GETTING ALL THE CATEGORIES
router.get("/categories", getAllCategory)

//update
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory)

//Delete
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, removeCategory)



module.exports = router;