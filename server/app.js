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


/////////////////////////////Database Connection////////////////////////
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
client.connect();



/////////////////////////////Add New User///////////////////////////////
app.post("/api/adduser", (req, res) => {
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
});


////////////////////////////Authenticate/////////////////////////////////
app.post("/api/authenticate", (req, res) => {
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
});

//////////////////////////////Add Blog//////////////////////////////////
app.post("/api/addblog", (req, res) => {
  // console.log(req.headers);
  if(req.headers.authorization === undefined){
    res.status(200).send({message: 'Access token required'});
    return;
  }
  else if (Object.keys(req.body).length === 0){
    res.status(200).send({message: 'Pass all blog field in body'});
    return;
  }
  else{
    for (item of [req.body.title, req.body.type, req.body.description, req.body.body, req.body.image]){
      // console.log(item);
      if(item === undefined || item === null){
        res.status(200).send({message: 'Some fields are missing. Pass all blog field in body'});
        return;
      }
    }
  }
  jwt.verify(req.headers.authorization.split(' ')[1], process.env.secretkey, function(err, decoded) {
    if(err){
      // console.log(err);
      res.status(200).send(err);
    }
    else{
      // console.log(decoded);
      client.query("SELECT userid, title from public.blog WHERE title=$1 AND isdeleted=false", [req.body.title])
      .then(result => {
        if(result.rows.length !== 0){
          res.status(200).send({message: "A blog with same title already exists"});
        }
        else{
          client.query("INSERT INTO public.blog(userid, title, type, description, body, image, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())", [decoded.userid, req.body.title, req.body.type, req.body.description, req.body.body, req.body.image])
          .then(result => {
            // console.log(result);
            res.status(201).send({message: "Blog added successfully"})
          })
          .catch(error => {console.log(error)});
        }
      })
      .catch(error => {console.log(error)});
    }
  });
  
});

//////////////////////////////Update Blog//////////////////////////////////
app.put("/api/updateblog", (req, res) => {
  // console.log(req.body);
  if(req.headers.authorization === undefined){
    res.status(200).send({message: 'Access token required'});
    return;
  }
  else if(req.body.blogid === undefined || req.body.blogid === null){
    res.status(200).send({message: 'Provide the blogid of the blog to be updated'});
    return;
  }
  else {
    for (item of [req.body.title, req.body.type, req.body.description, req.body.body, req.body.image]){
      // console.log(item);
      if(item === undefined || item === null){
        res.status(200).send({message: 'Some fields are missing. Pass all blog field in body'});
        return;
      }
    }
  }
  jwt.verify(req.headers.authorization.split(' ')[1], process.env.secretkey, function(err, decoded) {
    if(err){
      // console.log(err);
      res.status(200).send(err);
    }
    else{
      // console.log(decoded);
      client.query("UPDATE public.blog SET title=$1, type=$2, description=$3, body=$4, image=$5, updated_at=NOW() WHERE blogid=$6", [req.body.title, req.body.type, req.body.description, req.body.body, req.body.image, req.body.blogid])
      .then(result => {
        res.status(200).send({message: "Blog updated successfully"});
      })
      .catch(error => {console.log(error)});
    }
  });
});

//////////////////////////////Delete BLog///////////////////////////////
app.delete('/api/softdeleteblog', (req, res) => {
  // console.log(req.headers);
  // console.log(req.body);
  if(req.headers.authorization === undefined){
    res.status(200).send({message: 'Access token required'});
    return;
  }
  else if(req.body.blogid === undefined || req.body.blogid === null){
    res.status(200).send({message: 'Provide the blogid of the blog to be soft deleted'});
    return;
  }
  jwt.verify(req.headers.authorization.split(' ')[1], process.env.secretkey, function(err, decoded) {
    if(err){
      // console.log(err);
      res.status(200).send(err);
    }
    else{
      // console.log(decoded);
      if(decoded.role !== 'admin'){
        res.status(200).send({message: 'Unauthorized: Requires role as admin'});
      }
      else{
        client.query("UPDATE public.blog SET isdeleted=true, deleted_at=NOW() WHERE blogid=$1", [req.body.blogid])
        .then(r => {
          if(r.rowCount === 0){
            res.status(200).send({message: "Blog with given blogid not found (Already deleted)"})
          }else{
            res.status(200).send({message: "Soft deletion successful"});
          }
        })
        .catch(error => {console.log(error)});
      }
    }
  });
});

app.delete('/api/harddeleteblog', (req, res) => {
  // console.log(req.headers);
  // console.log(req.body);
  if(req.headers.authorization === undefined){
    res.status(200).send({message: 'Access token required'});
    return;
  }
  else if(req.body.blogid === undefined || req.body.blogid === null){
    res.status(200).send({message: 'Provide the blogid of the blog to be hard deleted'});
    return;
  }
  jwt.verify(req.headers.authorization.split(' ')[1], process.env.secretkey, function(err, decoded) {
    if(err){
      // console.log(err);
      res.status(200).send(err);
    }
    else{
      // console.log(decoded);
      if(decoded.role !== 'admin'){
        res.status(200).send({message: 'Unauthorized: Requires role as admin'});
      }
      else{
        client.query("DELETE FROM public.blog WHERE blogid=$1", [req.body.blogid])
        .then(r => {
          if(r.rowCount === 0){
            res.status(200).send({message: "Blog with given blogid not found (Already deleted)"})
          }else{
            res.status(200).send({message: "Hard deletion successful"});
          }
        })
        .catch(error => {console.log(error)});
      }
    }
  });
});

///////////////////////////Get User Details/////////////////////////////
app.get('/api/getuser', (req, res) => {
  if(req.headers.authorization === undefined){
    res.status(200).send({message: 'Access token required'});
    return;
  }
  jwt.verify(req.headers.authorization.split(' ')[1], process.env.secretkey, function(err, decoded) {
    if(err){
      // console.log(err);
      res.status(200).send(err);
    }
    else{
      // console.log(decoded);
      client.query("SELECT name, email, role from public.user WHERE userid=$1", [decoded.userid])
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
  });
});


///////////////////////////Update User Details//////////////////////////
app.put("/api/updateuser", (req, res) => {
  // console.log(req.headers);
  if(req.headers.authorization === undefined){
    res.status(200).send({message: 'Access token required'});
    return;
  }
  else if(req.body.name === undefined || req.body.name === null || req.body.email === undefined || req.body.email === null){
    res.status(200).send({message: 'Provide the updated name and email of the user to be updated'});
    return;
  }
  jwt.verify(req.headers.authorization.split(' ')[1], process.env.secretkey, function(err, decoded) {
    if(err){
      // console.log(err);
      res.status(200).send(err);
    }
    else{
      // console.log(decoded);
      client.query("UPDATE public.user SET name=$1, email=$2, updated_at=NOW() WHERE userid=$3", [req.body.name, req.body.email, decoded.userid])
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
  });
});

/////////////////////////////Update User Password///////////////////////
app.put("/api/updatepassword", (req, res) => {
  // console.log(req.headers);
  if(req.headers.authorization === undefined){
    res.status(200).send({message: 'Access token required'});
    return;
  }
  else if(req.body.oldpassword === undefined || req.body.oldpassword === null || req.body.newpassword === undefined || req.body.newpassword === null){
    res.status(200).send({message: 'Provide the oldpassword and newpassword of the user to be updated'});
    return;
  }
  jwt.verify(req.headers.authorization.split(' ')[1], process.env.secretkey, function(err, decoded) {
    if(err){
      // console.log(err);
      res.status(200).send(err);
    }
    else{
      // console.log(decoded);
      client.query("SELECT password from public.user WHERE userid=$1", [decoded.userid])
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
                client.query("UPDATE public.user SET password=$1, updated_at=NOW() WHERE userid=$2", [hash, decoded.userid])
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
  });
});

///////////////////////Get Blog of particular Type//////////////////////
app.get("/api/getblogwithtype/:type", (req, res) => {
  // console.log(req);
  if(req.params.type === 'All'){
    res.status(307).redirect("/api/getallblogs");
  }
  else{
    client.query("SELECT b.*, u.name AS authorname from public.blog b, public.user u WHERE b.userid=u.userid AND b.type=$1 AND b.isdeleted=false", [req.params.type])
    .then(result => {
      // console.log(result.rows);
      if(result.rows.length === 0){
        res.status(200).send({message: "No blogs found for this type"});
      }
      else{
        res.status(200).send({message: `${result.rows.length} blogs found for this type`, results: result.rows});
      }
    })
    .catch(error => {
      console.log(error);
    });
  }
});

/////////////////////////////Get All Blogs//////////////////////////////
app.get("/api/getallblogs", (req, res) => {
  client.query("SELECT b.*, u.name AS authorname from public.blog b, public.user u WHERE b.userid=u.userid AND b.isdeleted=false")
  .then(result => {
    // console.log(result.rows);
    if(result.rows.length === 0){
      res.status(200).send({message: "No blogs found"});
    }
    else{
      res.status(200).send({message: `${result.rows.length} blogs found`, results: result.rows});
    }
  })
  .catch(error => {
    console.log(error);
  });
});

/////////////////////////////Get User Blogs//////////////////////////////
app.get("/api/getuserblogs", (req, res) => {
  if(req.headers.authorization === undefined){
    res.status(200).send({message: 'Access token required'});
    return;
  }
  jwt.verify(req.headers.authorization.split(' ')[1], process.env.secretkey, function(err, decoded) {
    if(err){
      // console.log(err);
      res.status(200).send(err);
    }
    else{
      // console.log(decoded);
      client.query("SELECT b.*, u.name AS authorname FROM public.blog b, public.user u WHERE b.userid=$1 AND u.userid=$1 AND b.isdeleted=false", [decoded.userid])
      .then(result => {
        // console.log(result);
        if(result.rows.length === 0){
          res.status(200).send({message: "No blogs found"});
        }
        else{
          res.status(200).send({message: `${result.rows.length} blogs found`, results: result.rows});
        }
      })
      .catch(error => {
        console.log(error);
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