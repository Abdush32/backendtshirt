const Category = require("../models/category")

exports.getCategoryById = (req,res,next,id) => {

Category.findById(id).exec((err,cate) =>{
    if(err){
        return res.status(400).json({
            error:"Category Not Found in DB"
        })
    }
    req.category = cate; //request object
    next();
})


} 

//Create CATEGORY

exports.createCategory = (req,res) =>{
    const category = new Category(req.body);
    category.save((err,category) =>{
        if(err){
            return res.status(400).json({
                error:"Not able to save category in DB"
            })
        }
        res.json({category})
    })

}


exports.getCategory = (req,res) =>{
    return res.json(req.category)
}

exports.getAllCategory = (req,res) => {
    Category.find().exec((err,categories) =>{ // Categories means every single categories
        if(err){
            return res.status(400).json({
                error:"NO category found"
            });
        }
        res.json(categories)
    })
}


//update CATEGORY
exports.updateCategory = (req,res) => {
    const category = req.category;// we are able to grab req.category becz of  middleware in getCategoryById
    category.name = req.body.name;//this line is grabbing the category name which is being send in front-end or postman
    category.save((err,updateCategory) =>{
        if(err){
            return res.status(400).json({
                error:"Faild to update Category"
            })
        }
        res.json(updateCategory)
    })
}


//DELETE CATEGORY

exports.removeCategory = (req, res) => {
    const category = req.category;
  
    category.remove((err, category) => {
      if (err) {
        return res.status(400).json({
          error: "Failed to delete this category"
        });
      }
      res.json({
        message: "Successfull deleted"
      });
    });
  };
  