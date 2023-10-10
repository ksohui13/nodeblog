const mongoose = require("mongoose")

const CategoryShema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
    }, 
    {timestamps:true}
);

module.exports = mongoose.model("Category", CategoryShema)