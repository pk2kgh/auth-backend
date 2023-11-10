const User = require("../models/user");
const { initmail } = require("./SendMail");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const verifyUser = require("../models/verifyUser");
dotenv.config();
async function InsertVerifyUser(name, email, password) {
  try {
    const salt = await bcrypt.genSalt(10);
    console.log("salt:", salt);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("hashedPassword:", hashedPassword);
    const token = generateToken(email);
    console.log("token:", token);
    const newUser = new verifyUser({
      name: name,
      email: email,
      password: hashedPassword,
      token: token,
    });

    const activationLink = `https://auth-be-z4lz.onrender.com/signup/${token}`;
    const resHtml_ActMail=`<!DOCTYPE html>
    <html>
    <head>
      <title>My App</title>
      <style>
        /* Responsive CSS */
        header, footer {
          width: 100%;
          text-align: center;
        }
    
        main {
          margin: 0 auto;
          max-width: 600px;
        }
    
        a {
          width: 100%;
        }
    
        p {
          margin-bottom: 1rem;
        }
    
        @media (max-width: 576px) {
          main {
            max-width: none;
          }
        }
    
        .box {
          border: 1px solid #ccc;
          padding: 1rem;
          margin: 0 auto;
          max-width: 600px;
        }
    
        .box h5 {
          text-align: center;
          margin-top: 0;
        }
    
        .box p {
          margin-bottom: 0;
        }
    
        .box a {
          display: block;
          text-align: center;
          background-color: #000;
          color: #fff;
          padding: 0.5rem;
          margin-top: 1rem;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>My App</h1>
      </header>
    
      <main>
        <div class="box">
          <h5>Welcome to the app</h5>
          <p>Thank you for signing up. Click on the below link to activate</p>
          <a href="${activationLink}">Click here</a>
          <p>Regards</p>
          <p>Admin Team</p>
        </div>
      </main>
    
      <footer>
        <p>Copyright &copy; 2023 My App</p>
      </footer>
    </body>
    </html>
    `
    const content = resHtml_ActMail;

    // const content = `<h4>Hi,there</h4>
    //                 <h5>Welcome to the app</h5>
    //                 <p>Thank you for signing up.Click on the below link to activate</p>
    //                 <a href="${activationLink}">click here</a>
    //                 <p>Regards</p>
    //                 <p>Admin Team</p>`;
    await newUser.save();
    initmail(email, "VerifyUser", content);
    //Yet to be added
  } catch (e) {
    console.log(e);
  }
}

function generateToken(email) {
  const token = jwt.sign(email, process.env.seck);
  return token;
}

async function InsertSignUpUser(token) {
  try {
    const userVerify = await verifyUser.findOne({ token: token });
    if (userVerify) {
      const newUser = new User({
        name: userVerify.name,
        email: userVerify.email,
        password: userVerify.password,
        forgetPassword: {},
      });
      await newUser.save();
      await userVerify.deleteOne({ token: token });
      const content = `<h4>Registeration successfull</h4>
                      <h5>Welcome to the app</h5>
                      <p>You have Successfully Registered</p>
                      <p>Regards</p>
                      <p>Admin Team</p> `;
      initmail(newUser.email, "Registeration successful", content);
      return `<h4>Hi, there </h4>
              <h5>Welcome to the app</h5>
              <p>You are successfully registered</p>
              <p>Regards</p>
              <p>Admin Team</p>`;
    }

    return `<h4> Registeration failed</h4>
            <p>Link expired......</p>
            <p>Regards</p>
            <p>Team</p>`;
  } catch (e) {
    console.log(e);
    return `<html>
              <body>
                <h4> Registeration failed</h4>
                <p>Unexpected error happenned ....</p>
                <p>Regards</p>
                <p>Team</p>
              </body>
            </html>`;
  }
}

module.exports = { InsertVerifyUser, InsertSignUpUser };
