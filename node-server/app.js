const express = require("express");
const fs = require("fs");
const path = require('path');
const app = express();
const port = 8080;
let userNum = 0;

function trackUserID(){
    userNum = 0;
    fs.readFile(__dirname + "/data/" + "users.json", 'utf8', function(err, data){
        data = JSON.parse(data);
        for(let user in data){
            userNum++;
        }
    }); 
    userNum++;
}

trackUserID();

app.use( function ( req, res, next ) {
    const { url, path: routePath } = req ;
    console.log( 'Request: Timestamp:', new Date().toLocaleString(), ', URL (' + url + '), PATH (' + routePath + ').' ) ;
    next();
});
app.use('/', express.static(path.join(__dirname, '')))
app.listen(port, () => {
    console.log(`Server running on port ${port}...`)
});

app.get('/api/v1/listUsers', function(req, res) {
    fs.readFile(__dirname + "/data/" + "users.json", 'utf8', function(err, data){
    trackUserID();
    console.log (data);
    res.end(data);
    });
});

app.post('/api/v1/addUser' , (req , res)=>{

    fs.readFile(__dirname + "/data/" + "users.json", 'utf8', function(err, data){

        data = JSON.parse(data);

        currentUser = "user" + userNum; // Keeps track of user ID to use for naming JSON object
        userNum++;

        let newUser = {
            [currentUser] : {
                "name": req.query["name"],
                "password": req.query["password"],
                "profession": req.query["profession"],
                "id": req.query["user"]
            }
        }
        

        data = {
            ...data,
            ...newUser
        }

        fs.writeFile(__dirname + "/data/users.json", JSON.stringify(data), err => {
         if (err) {
         console.error(err);
         return;
         }
        });
        console.log(data);
        res.end(JSON.stringify(data));
    });
});

app.delete('/api/v1/deleteUser', function(req, res){

    fs.readFile(__dirname + "/data/" + "users.json", 'utf8', function(err, data){
     
        // console.log(data); // Data of users.json file in JSON Format
     
     data = JSON.parse(data);
     
     // console.log(data); // Data of users.json file as Javascript Object

     delete data["user"+req.query["user"]];
     fs.writeFile(__dirname + "/data/users.json", JSON.stringify(data), err => {
      if (err) {
      console.error(err);
      return;
      }
     });
     console.log(data);
     res.end(JSON.stringify(data));
    });
});