const User=require("../models/user");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const client = require("../redis");
dotenv.config();
async function CheckUser(email){
    try{
        const user=await User.findOne({email:email});
        //console.log(user);
        if(user){
            return true;
        }
        return false;
    }
    catch(e){
        console.log(e);
        return "server busy doi";
    }
}

async function AuthenticateUser(email, password) {
    try {
    const userCheck = await User.findOne({ email: email });
    console.log("@ usercheck:\n",userCheck);
    console.log(password);
    console.log(userCheck.password);
    const validPassword = await bcrypt.compare(password, userCheck.password);
    console.log("@ vp:",validPassword);
    if (validPassword) {
        const token = jwt.sign({ email }, process.env.logink);
        console.log("@ signToken:\n",token);
        const response = {
        id: userCheck ._id,
        name: userCheck.name,
        email: userCheck.email,
        token: token,
        status: true,
        };
        //console.log("@ response: \n",response);
        //console.log(`key-${email}`);
        await client.set(`key-${email}`,JSON.stringify(response))
        const findupdate=await User.findOneAndUpdate(
                                                    { email: userCheck.email },
                                                    { $set: { token: token } },

                                                    { new: true }
                                                    );
        //console.log("@ findupdate: \n",findupdate);
        return response;
    }
    return "Invalid User name or Password";
    } catch (e) {
    console.log(e);
    return "Server Busy";
    }
    }

async function AuthorizeUser(token){
    try {
        const decodedToken=jwt.verify(token,process.env.logink);
        console.log("\n@ decodedToken:",decodedToken);
        if(decodedToken){
            const email=decodedToken.email;
            const auth=await client.get(`key-${email}`);
            console.log("\n@ auth:\n",auth);
            if(auth){
                const data=JSON.parse(auth);
                console.log("\n@ parse json:",data);
                return data;
            }
            else{
                const data=await User.findOne({email:email});
                console.log("\n@ find db json:",data);
                return data;
            }
        }
        return false;

    } catch (error) {
        console.log(error);
    }
}
module.exports={CheckUser,AuthenticateUser,AuthorizeUser};