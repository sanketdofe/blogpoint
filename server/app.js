const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

clientport = "localhost:3000";

/////////////////////////////Database Connection////////////////////////
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT
});
client.connect();

////////////////////////////////React App//////////////////////////////
app.get("/", (req, res) => {
    res.redirect(clientport);
});


/////////////////////////////Add New User///////////////////////////////
app.post("/api/adduser", (req, res) => {
  // console.log(req.body);
  client.query("SELECT email FROM public.user WHERE email=$1", [req.body.email])
  .then(result => {
    if(result.rows.length === 0){
      bcrypt.hash(req.body.password, saltRounds)
      .then(hash => {
        client.query("INSERT INTO public.user(name, email, password, created_at) VALUES ($1, $2, $3, NOW())", [req.body.name, req.body.email, hash])
        .then(result => {
          // console.log(result);
          res.status(200).send({message: "User Added Successfully"});
        })
        .catch(error => {console.log(error)});
      })
      .catch(error => {console.log(error)});
    }
    else{
      res.send({message: "User with same email already exists"});
    }
  })
  .catch(error => {console.log(error)});
});


////////////////////////////Authenticate/////////////////////////////////
app.post("/api/authenticate", (req, res) => {
  // console.log(req.body);
  client.query("SELECT userid, name, email, password FROM public.user WHERE email=$1", [req.body.email])
  .then(result => {
    if(result.rows.length === 0){
      res.send({message: "No such User found. Please Register"});
    }
    else{
      // console.log(result.rows);
      bcrypt.compare(req.body.password, result.rows[0].password)
      .then(function(same) {
        if(same){
          var token = jwt.sign({ id: result.rows[0].userid, email: result.rows[0].email}, process.env.secretkey, {
            expiresIn: 1800
          });
          res.send({
            message: "Authentication Success",
            userid: result.rows[0].userid,
            name: result.rows[0].name,
            accessToken: token
          });
        }
        else{
          res.send({message: "Wrong Password"});
        }
      })
      .catch(error => {console.log(error)});
    }
  })
  .catch(error => {console.log(error)});
});

//////////////////////////////Port Setup////////////////////////////////
app.listen(process.env.PORT || "5000", function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Server is up on port 5000");
    }
  }); 