const {Order,ProductCart} = require("../models/order")

exports.getOrderById = (req,res,next,id) => {
Order.findById(id).
populate("products.product", "name price"). // if you want more info populate so you can add here
exec((err,order) => {
    if(err){
        return res.status(400).json({
            error:"No order found in DB"
        })
    }
    req.order = order;
next();
})
} 

//CREATE ORDER

exports.createOrder = (req,res) =>{
    req.body.order.user = req.profile; //we use req.profile becz we are dependent on Models/order/user
    const order = new Order( req.body.order)
    order.save((err,order) =>{
        if(err){
            return res.status(400).json({
                error:"Failed to Save your order in DB"
            })
        }  
        res.json(order) 
    })
}


exports.getAllOrders = (req,res) =>{
    Order.find() // when we dont pass anything it works for All
    .populate("user", "_id name")
    .exec((err,order) =>{
        if(err){
            return res.status(400).json({
                error:"No Order found in DB"
            })
        }  
        res.json(order) 
    })
}


exports.getOrderStatus = (req,res) =>{
    res.json(Order.schema.path("status").enumValues);
}


exports.updateStatus = (req,res) =>{
    Order.update(
        {_id: req.body.orderId},
        {$set: {status: req.body.status}},
        (err,order) =>{
            if(err){
                return res(400).json({
                    error:"Cannot Update order Status"
                })
            }
            res.json(order)
        }
    )

}