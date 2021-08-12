const express = require("express")
const router = express.Router()


const 
{getProductById,createProduct,getProduct,photo,updateProduct,deleteProduct,getAllProduct,getAlluniquecategories}
 = require("../controllers/product")

const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth") 
const {getUserById} = require("../controllers/user")// we will extract more information 

//ankhein  chubhtii
//ALL PARAMS
router.param("userId",getUserById); 
router.param("productId",getProductById);

//Actual routes goes here
//create route
 router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct) 


//read route
router.get("/product/:productId", getProduct)//It is grabbing one category itself
//Temproray route
router.get("/product/photo/:productId", photo)
//{PRODUCT} means == T-shirt product


//update
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct)
//Delete
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct)

// listing route
router.get("/products", getAllProduct)

//This is for category select category/winter summer

router.get("/products/categories", getAlluniquecategories)


module.exports = router;