const  express = require("express");
const router = express.Router();


const {isSignedIn,isAuthenticated} = require("../controllers/auth")
const {getToken,processPayment}  = require("../controllers/paypalpayment");
const { getUserById } = require("../controllers/user");

router.get("/payment/gettoken/:userId", isSignedIn,isAuthenticated,getToken);

router.post("/payment/braintree/:userId",isSignedIn,isAuthenticated,processPayment);
router.param("userId", getUserById);
module.exports = router;