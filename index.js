const express = require('express')
const app = express();
app.use(express.json());
const nodemailer = require("nodemailer");
const user = require('./model/user.shema');
const connect = require('./confing/db');

// otp
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'priyanshiitaliya32@gmail.com',
    pass: 'mlmx ntnb lyna hgac'
  }
});

let otp = Math.floor(Math.random()*100000);
app.post("/otp", async (req, res) => {
  let {email}= req.body;
  const mailOptions = {
    from: 'priyanshiitaliya32@gmail.com',
    to:email,
    subject: "password reset",
    html: `<h1>OTP ${otp}</h1>`
  };
 await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
    res.send("send otp");
  });
})

// otp varify
app.post("/varify", async (req, res) => {
  let { cotp, password ,email} = req.body;
  if (cotp == otp) {
    let userdata = await user.findOne({ email: email })
    console.log(userdata)
    if (userdata) {
      userdata.password = password
      await userdata.save();
      res.send("password updated successfully");
    }
    else {
      res.send("user not found");
    }
  }
  else {
    res.send("wrong otp")
  }
})

// signup get method
app.get('/signup',async(req, res) => {
  let data = await user.find()
res.send(data)
})

// signupdata
app.post("/signup", async (req, res) => {
  const {username ,password , email} = req.body

  let userdatas = await user.findOne({email : email})
  if(userdatas){
      res.send("user exists")
  }
  else{
  let data = await user.create(req.body);
  res.send(data);
  console.log(data);
  }
})

app.listen(8090, () => {
  connect()
  console.log("listening on port start...");
})