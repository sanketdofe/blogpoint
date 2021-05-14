const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(bodyParser.json({
  extended: false
}));
app.use(cors());

clientport = "localhost:3000";

////////////////////////////////React App//////////////////////////////
app.get("/", (req, res) => {
    res.redirect(clientport);
});


/////////////////////////////Add New User///////////////////////////////
app.post("/api/adduser", (req, res) => {
  console.log(req.body);
  res.send("Success");
});


////////////////////////////Authenticate/////////////////////////////////
app.post("/api/authenticate", (req, res) => {
  console.log(req.body);
  res.send("Success");
});

//////////////////////////////Port Setup////////////////////////////////
app.listen(process.env.PORT || "5000", function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Server is up on port 5000");
    }
  }); 