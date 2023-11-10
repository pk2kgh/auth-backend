const express = require("express");
const { AuthenticateUser } = require("../controller/login");
var router = express.Router();
const client = require("../redis");


router.post("/", async (req, res) => {
  console.log("inside login");
  const { email, password } = await req.body;
  console.log("@@@@@@@@@@@\n",password);
  var loginCredentials = await AuthenticateUser(email, password);
  console.log("@ loginCred: \n",loginCredentials);
  if (loginCredentials === "Invalid User name or Password") {
    res.status(200).send("Invalid User name or Password");
  } else if (loginCredentials === "Server Busy") {
    res.status(200).send("Server Busy");
  } else {
    res.status(200).json({token:loginCredentials.token});
  }
});

module.exports = router;
