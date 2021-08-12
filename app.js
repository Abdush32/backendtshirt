require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const  cors = require('cors')
const app = express()

//MY ROUTES
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")// product means tshirt product
const orderRoutes = require("./routes/order")
const stripeRoutes = require("./routes/stripepayment")
const paypalRoutes = require("./routes/paypalpayment")

//DB CONNECTION
mongoose.connect(process.env.DATABASE,
{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
.then(() => {
    console.log('DB CONNECTED!!');
}).catch(
    console.log("DB GOT OOPS")
)

//MIDDLEWARE

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors())
const port = process.env.PORT || 3000

//MY ROUTES
app.use("/api", authRoutes) //PREFIXING WITH /api
app.use("/api", userRoutes)
app.use("/api", categoryRoutes)
app.use("/api", productRoutes)
app.use("/api", orderRoutes)
app.use("/api", stripeRoutes)
app.use("/api", paypalRoutes)





 //SERVER START
app.listen(port, () => {
    console.log(`App is Running at${port}`)
  })