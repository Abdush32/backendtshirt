const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32,
        unique:true
    }
    },
    {timestamps: true} //it record the exact time
  );

  module.exports = mongoose.model("Category", categorySchema)