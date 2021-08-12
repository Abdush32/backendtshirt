const stripe = require("stripe")
("sk_test_51J5w1OSDxwflDMzIqtPgKIfHf9SC3YP0UF1lTxwCxzLdeWj3XGa0S7vOWKfszTXV47EJ45cqAwljOFOHNxjOisGF00NhX2Mzh7")
const uuid = require("uuid/v4")


exports.makepayment = (req,res) =>{
const {products,token} = req.body
console.log("products",products)

let amount = 0;
products.map(p => {
    amount = amount + p.price;
})
const idempotencyKey = uuid()

    return stripe.customers.create({
        email: token.email,
        source:token.id
    }).then(customer => {
        stripe.charges.create({
amount:amount*100,
currency:"usd",
customer:customer.id,
receipt_email:token.email,
description:"product has been purchased",
shipping:{
    name:token.card.name,
    address:{
        line1:token.card.address_line1,
        line2:token.card.address_line2,
        city:token.card.address_city,
        country: token.card.address_country,
        postal_code: token.card.address_zip
    }
}

        },{idempotencyKey})
        .then(result => res.status(200).json(result))
        .catch(err => console.log(err))
    })



}