import dotenv from 'dotenv';
import pkg from 'pg';
const {Client} = pkg;
import bcrypt from "bcrypt";
const saltRounds = 10;
import jwt from 'jsonwebtoken';

dotenv.config();

/////////////////////////////Database Connection////////////////////////
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT
});
client.connect();


/////////////////////////////Controllers////////////////////////////////

////////////////////Add New User////////////////////
export const addUser = (req, res) => {
  // console.log(req.body);
  client.query("SELECT email FROM public.user WHERE email=$1", [req.body.email])
  .then(result => {
    if(result.rows.length === 0){
      bcrypt.hash(req.body.password, saltRounds)
      .then(hash => {
        client.query("INSERT INTO public.user(name, email, password, role, created_at) VALUES ($1, $2, $3, $4, NOW())", [req.body.name, req.body.email, hash, req.body.role])
        .then(result => {
          // console.log(result);
          res.status(201).send({message: "User Added Successfully"});
        })
        .catch(error => {console.log(error)});
      })
      .catch(error => {console.log(error)});
    }
    else{
      res.status(200).send({message: "User with same email already exists"});
    }
  })
  .catch(error => {console.log(error)});
}


////////////////////Authenticate////////////////////
export const authenticateUser = (req, res) => {
  // console.log(req.body);
  client.query("SELECT userid, name, email, password, role FROM public.user WHERE email=$1", [req.body.email])
  .then(result => {
    if(result.rows.length === 0){
      res.status(200).send({message: "No such User found. Please Register"});
    }
    else{
      // console.log(result.rows);
      if(result.rows[0].role !== req.body.role){
        res.status(200).send({message: 'Your role does not qualify'});
      }
      else{
        bcrypt.compare(req.body.password, result.rows[0].password)
        .then(function(same) {
          if(same){
            var token = jwt.sign({ userid: result.rows[0].userid, email: result.rows[0].email, role: result.rows[0].role}, process.env.secretkey, {
              expiresIn: 1800
            });
            res.send({
              message: "Authentication Success",
              userid: result.rows[0].userid,
              name: result.rows[0].name,
              role: result.rows[0].role,
              accesstoken: token
            });
          }
          else{
            res.status(200).send({message: "Wrong Password"});
          }
        })
        .catch(error => {console.log(error)});
      }
    }
  })
  .catch(error => {console.log(error)});
}


////////////////////Get User Details////////////////////
export const getUserDetails = (req, res) => {
  client.query("SELECT name, email, role from public.user WHERE userid=$1", [res.locals.userid])
  .then(result => {
    if(result.rows.length === 0){
      res.status(200).send({message: "User Not found"});
    }
    else{
      res.status(200).send({message: "User Found", ...result.rows[0]});
    }
  })
  .catch(error => {console.log(error)});
}


////////////////////////Update User Details////////////////////////
export const updateUserDetails = (req, res) => {
  if(req.body.name === undefined || req.body.name === null || req.body.email === undefined || req.body.email === null){
    res.status(200).send({message: 'Provide the updated name and email of the user to be updated'});
    return;
  }
  client.query("UPDATE public.user SET name=$1, email=$2, updated_at=NOW() WHERE userid=$3", [req.body.name, req.body.email, res.locals.userid])
  .then(result => {
    // console.log(result);
    if(result.rowCount === 0){
      res.status(200).send({message: "User not found"});
    }
    else{
      res.status(200).send({message: "Update Successful"});
    }
  })
  .catch(error => {
    console.log(error);
  });
}


////////////////////////Update User Password//////////////////////
export const updateUserPassword = (req, res) => {
  if(req.body.oldpassword === undefined || req.body.oldpassword === null || req.body.newpassword === undefined || req.body.newpassword === null){
    res.status(200).send({message: 'Provide the oldpassword and newpassword of the user to be updated'});
    return;
  }
  client.query("SELECT password from public.user WHERE userid=$1", [res.locals.userid])
  .then(result => {
    if(result.rows.length === 0){
      res.status(200).send({message: "No User found"});
    }
    else{
      bcrypt.compare(req.body.oldpassword, result.rows[0].password)
      .then(function(same) {
        if(same){
          bcrypt.hash(req.body.newpassword, saltRounds)
          .then(hash => {
            client.query("UPDATE public.user SET password=$1, updated_at=NOW() WHERE userid=$2", [hash, res.locals.userid])
            .then(result => {
              res.status(200).send({message: "Password updated successfully"});
            })
            .catch(error => {console.log(error)});
          })
          .catch(error => {console.log(error)});
        }
        else{
          res.status(200).send({message: "Current password Incorrect"});
        }
      })
      .catch(error => {console.log(error)});
    }
  })
  .catch(error => {
    console.log(error);
  });
}