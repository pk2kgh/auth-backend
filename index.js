console.log("Hellla");
const connectDb=require("./db");
const express = require('express');
const client=require("./redis");

const app = express();
const port = 3000;
connectDb();
client.connect();





app.get('/hello', (req, res) => {
  res.send('Hello World!');console.log(`inside / in  ${port}`);
})
app.get('/gg', (req, res) => {
    res.send(' good to go!');
    console.log(`inside gg in  ${port}`);
  })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})




const cors=require("cors");
app.use(express.json());//whenever get post ,make sure it hits json middleware
app.use(cors({origin:"*"}));//to avoid crossover reosource sharing,

var signupRouter=require("./routes/signup");
app.use("/signup",signupRouter);

var loginRouter=require("./routes/login");
app.use("/login",loginRouter);

var homeRouter=require("./routes/home");
app.use("/home",homeRouter);













