const User = require("../models/user")
const Order = require("../models/order") 


exports.getUserById = (req,res,next,id) =>{
    User.findById(id).exec((err,user) =>{
if(err || !user){
    return res.status(400).json({
        error: "No user was found in DB"
    })
}
req.profile = user;
next();

    })
}


exports.getUser = (req,res) =>{ // we want to grab the user
    req.profile.salt = undefined;
    req.profile.encry_password = undefined // all the undefined value dont show up
    return res.json(req.profile)
}

// exports.getAllusers = (req,res) =>{
//     User.find().exec((err,users) =>{
//         if(err || !users){
//             return res.status(400).json({
//                 error:"not getting AllUsers"  //GETTING ALL THE DATA FROM DATABASE
//             })
//         }
//         res.json(users)
//     })
// }

//UPDATE USER

exports.updateUser = (req,res) =>{
    User.findByIdAndUpdate(
        {_id : req.profile._id},
        {$set: req.body},
        {new:true, useFindAndModify: false},
        (err,user) => {
            if(err){
                return res.status(400).json({
                    error:"you are not Authorised to update this user"
                });
            }
            user.salt = undefined;        //we are not using profile here bcz we are updating user only
            user.encry_password = undefined;
            res.json(user)
        }
    )
}



exports.userPurchaseList = (req,res) =>{
Order.find({user: req.profile._id})
.populate("user", "_id name")
.exec(() =>{
    if(err){
        return res.status(400).json({
            error: "No Order in this Account"
        })
    }
    return res.json(order);
})
}

//PUTTING ORDER IN WISH LIST

exports.pushOrderInPurchaseList = (req, res, next) =>{
    let purchases = []
    req.body.order.products.forEach(product =>{
purchases.push({
    _id:product._id,
    name:product.name,
    description:product.description,
    category:product.category,
    quantity:product.quantity,
    amount:req.body.order.amount,
    transaction_id:req.body.order.transaction_id
})
    })
//STORE ALL THIS IN DB

User.findOneAndUpdate(
    {_id:req.profile._id},
    {$push:{purchases:purchases}},
    {new:true},//this is used to send updated one database from db return
    (err,purchases) => {
        if(err){
            return res.status(400).json({
                error:"unable to save purchase List"
            })
        }
        next();
    }
)





}