const express = require("express");
const { CheckUser } = require("../controller/login");
const { InsertVerifyUser, InsertSignUpUser } = require("../controller/signup");
var router = express.Router();


  
  router.get("/:token", async (req, res) => {
    console.log("middleware  working");
    try {
      console.log(req.params.token);
      const response = await InsertSignUpUser(req.params.token);
      console.log(response);
      res.status(200).send(response);
    } catch (e) {
      console.log(e);
      res.status(500).send(`
    <html>
      <body>
        <h4> Registeration failed</h4>
        <p>Link expired .....< /p>
        <p>Regards</p>
        <p>Admin Team</p>
      </body>
    </html>`);
    }
  });
router.post("/verify", async (req, res) => {
  console.log("middleware verify working");

  try {
    const { name, email, password } = await req.body;
    console.log(name, password, email);
    const registrarStatus = await CheckUser(email);
    console.log("registrarStatus:",registrarStatus);
    if (registrarStatus === false) {
      //if User is not verified then a function to send them to VerifyUser
      await InsertVerifyUser(name,email,password);
      res.status(200).send(true);
    } else if (registrarStatus === true) {
      //if User is already in DB,return false since no need to add user
      res.status(200).send(false);
    } else if (registrarStatus === "server busy doi") {
      res.status(200).send("Busy bro");
      console.log("Busy da");
    }
  } catch (e) {
    console.log("error routes/signup:",e);
  }
});

module.exports = router;
