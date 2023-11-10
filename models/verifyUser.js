const mgs=require("mongoose");

const verifySchema=new mgs.Schema(
{
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
       
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    },

},

{
collection:"VerifyUser"
}

);

module.exports=mgs.model("VerifyUser",verifySchema);
