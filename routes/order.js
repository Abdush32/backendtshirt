const express = require("express")
const router = express.Router()

const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth")
const {getUserById,pushOrderInPurchaseList} = require("../controllers/user")// we will extract more information
const {updateStock} = require("../controllers/product")
const {getOrderById,createOrder, getAllOrders,getOrderStatus,updateStatus} = require("../controllers/order")


//PARAMS
router.param("userId", getUserById) // It populate the req.profile for us
router.param("orderId",getOrderById)

//create order route
router.post("/order/create/:userId",isSignedIn,isAuthenticated,pushOrderInPurchaseList,updateStock,createOrder)
//READ
router.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders)

//STATUS OF ORDER
router.get("/order/status/:userId",
isSignedIn,isAuthenticated,isAdmin,getOrderStatus
)
router.put("/order/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus)

module.exports = router;