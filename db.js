const mongoose=require("mongoose");

const dEnv=require("dotenv");
dEnv.config();

const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.mongoDbUrl);
        console.log("Connected to MongoDb Sucessfully");
        //waits for code to happens
    }
    catch(error){
        console.log(error);
    }
};

module.exports=connectDb;
