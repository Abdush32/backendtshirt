const Product = require("../models/product");
const formidable = require('formidable');
var _ = require('lodash');
const fs = require("fs"); // it is filesystem its preinstalled in node
const product = require("../models/product");





exports.getProductById = (req,res,next,id) =>{
    Product.findById(id)
    .populate("category")
    .exec((err,product) =>{
if(err){
    return res.status(400).json({
        error:"Product not found"
    })
}

req.product = product;
next();
    })
}


//create T-shirt product
exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image"
        });
      }
  
  //destructure of fields
  //putting restriction on fields 
const {name,description,price,category,stock} = fields // All coming up from models
if(
    !name || !description ||
    !price || !category ||
    !stock
    ){
        
            return res.status(400).json({
              error: "please include all fields"
            });
          
        }

      let product = new Product(fields);
  
      //handle Image file here
      if (file.photo) {
        if (file.photo.size > 3000000) {
          return res.status(400).json({
            error: "File size too big!"
          });
        }
        product.photo.data = fs.readFileSync(file.photo.path);
        product.photo.contentType = file.photo.type; //for the database
      }
  console.log(product);
      //save to the DB
      product.save((err, product) => {
        if (err) {
          res.status(400).json({
            error: "Saving tshirt in DB failed"
          });
        }
        res.json(product);
      });
    });
  };
  
//product means tshirt product
//this is for optimization binary data
// this part is the front-end
  exports.getProduct = (req,res) =>{
      req.product.photo = undefined;// bulky photos will be undefined
      return res.json(req.product)

  }
//middleware
//it is used load in the background
 exports.photo = (req,res,next) =>{
     if(req.product.photo.data){
         res.set("Content-Type",req.product.photo.contentType)
         return res.send(req.product.photo.data)

     }
     next()
 } 

 exports.deleteProduct = (req,res) =>{
     let product = req.product;
product.remove((err, deletedProduct) =>{
    if(err){
        return res.status(400).json({
            error:"Failed to delete the product"
        })
    }
    res.json({
        message:"Deletion was sucessfull", 
        deletedProduct
    })
})
 }
//  exports.deleteProduct = (req, res) => {
//   let product = req.product;
//   product.remove((err, deletedProduct) => {
//     if (err) {
//       return res.status(400).json({
//         error: "Failed to delete the product"
//       });
//     }
//     res.json({
//       message: "Deletion was a success",
//       deletedProduct
//     });
//   });
// };


//update product
 exports.updateProduct = (req,res) => {

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }



//This is responsible for updation
    let product = req.product;
    product = _.extend(product, fields) //_.extends::: //fields are comng from formidable
    // it takes the existing value that you are you having from the object
    //it also update the value

    //handle Image file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
console.log(product);
    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Updation of product failed"
        });
      }
      res.json(product);
    });
  });

 }


 //product listing
 //how many product you wanna show on front-end

 exports.getAllProduct = (req,res) => {
  
let limit = req.query.limit ? parseInt(req.query.limit): 12
let sortBy = req.query.sortBy ? req.query.sortBy : "_id" // we dont have any to sort it takes by _id
  Product.find()
  .select("-photo") // -photo is means dont wann photo
  .populate("category")
  .sort([[sortBy, "asc"]]) // we can sort by name or etc..asc,desc
  .limit(limit)
  .exec((err, product) =>{
    if(err){
      return  res.status(400).json({
        error:"No product found!"
      })
    }
    res.json(product)
  })
 }

//  Update Stock
 exports.updateStock = (req,res,next) =>{
   let myOperations = req.body.order.products.map(prod =>{
     return {
       updateOne : {
         filter:{_id: prod._id},
         update: {$inc: {stock: -prod.count, sold: +prod.count}}
       }
     }
   })
   Product.bulkWrite(myOperations, {}, (err,products) =>{ // focus bulkwrite on mongoose

     if(err){
       return res.status(400).json({
         error:"Bulk operation failed"
       })
     }
     next();
   })
 }

//This is for category part like SUMMER/WINTER
 exports.getAlluniquecategories = (req,res) =>{
   Product.distinct("category", {},(err,category) =>{ //spend Time on model.distinct()
     if(err){
      return res.status(400).json({
        error: "No Category Found"
      })
     }
     res.json(category)


   })
 }