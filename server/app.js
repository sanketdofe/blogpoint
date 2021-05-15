const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const app = express();

app.use(express.json({limit: '5mb'}));
app.use(
  express.urlencoded({
    limit: '5mb',
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
          var token = jwt.sign({ userid: result.rows[0].userid, email: result.rows[0].email}, process.env.secretkey, {
            expiresIn: 1800
          });
          res.send({
            message: "Authentication Success",
            userid: result.rows[0].userid,
            name: result.rows[0].name,
            accesstoken: token
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

//////////////////////////////Add Blog//////////////////////////////////
app.post("/api/addblog", (req, res) => {
  // console.log(req.headers);
  jwt.verify(req.headers.authorization.split(' ')[1], process.env.secretkey, function(err, decoded) {
    if(err){
      // console.log(err);
      res.send(err);
    }
    else{
      // console.log(decoded);
      client.query("SELECT userid, title from public.blog WHERE title=$1", [req.body.title])
      .then(result => {
        if(result.rows.length !== 0){
          res.send({message: "A blog with same title already exists"});
        }
        else{
          client.query("INSERT INTO public.blog(userid, title, topic, description, body, image, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())", [decoded.userid, req.body.title, req.body.topic, req.body.description, req.body.body, req.body.image])
          .then(result => {
            // console.log(result);
            res.send({message: "Blog added successfully"})
          })
          .catch(error => {console.log(error)});
        }
      })
      .catch(error => {console.log(error)});
    }
  });
  
});

///////////////////////////Get User Details/////////////////////////////
app.get('/api/getuser', (req, res) => {
  jwt.verify(req.headers.authorization.split(' ')[1], process.env.secretkey, function(err, decoded) {
    if(err){
      // console.log(err);
      res.send(err);
    }
    else{
      // console.log(decoded);
      client.query("SELECT name, email from public.user WHERE userid=$1", [decoded.userid])
      .then(result => {
        if(result.rows.length === 0){
          res.send({message: "User Not found"});
        }
        else{
          res.send({message: "User Found", ...result.rows[0]});
        }
      })
      .catch(error => {console.log(error)});
    }
  });
});


///////////////////////////Update User Details//////////////////////////
app.post("/api/updateuser", (req, res) => {
  // console.log(req.headers);
  jwt.verify(req.headers.authorization.split(' ')[1], process.env.secretkey, function(err, decoded) {
    if(err){
      // console.log(err);
      res.send(err);
    }
    else{
      // console.log(decoded);
      client.query("UPDATE public.user SET name=$1, email=$2, updated_at=NOW() WHERE userid=$3", [req.body.name, req.body.email, decoded.userid])
      .then(result => {
        // console.log(result);
        res.send({message: "Update Successful"});
      })
      .catch(error => {
        console.log(error);
        res.send(error);
      });
    }
  });
});

/////////////////////////////Update User Password///////////////////////
app.post("/api/updatepassword", (req, res) => {
  // console.log(req.headers);
  jwt.verify(req.headers.authorization.split(' ')[1], process.env.secretkey, function(err, decoded) {
    if(err){
      // console.log(err);
      res.send(err);
    }
    else{
      // console.log(decoded);
      client.query("SELECT password from public.user WHERE userid=$1", [decoded.userid])
      .then(result => {
        if(result.rows.length === 0){
          res.send({message: "No User found"});
        }
        else{
          bcrypt.compare(req.body.oldpassword, result.rows[0].password)
          .then(function(same) {
            if(same){
              bcrypt.hash(req.body.newpassword, saltRounds)
              .then(hash => {
                client.query("UPDATE public.user SET password=$1, updated_at=NOW() WHERE userid=$2", [hash, decoded.userid])
                .then(result => {
                  res.status(200).send({message: "Password updated successfully"});
                })
                .catch(error => {console.log(error)});
              })
              .catch(error => {console.log(error)});
            }
            else{
              res.send({message: "Current password Incorrect"});
            }
          })
          .catch(error => {console.log(error)});
        }
      })
      .catch(error => {
        console.log(error);
        res.send(error);
      });
    }
  });
});

//////////////////////////////Port Setup////////////////////////////////
app.listen(process.env.PORT || "5000", function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is up on port 5000");
  }
}); 