var express=require("express");
var bodyParser=require("body-parser");

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/gfg');
let db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
    console.log("connection succeeded");
})

var app=express()


app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/createAccount', (req,res) =>{


})


app.get('/form',function(req,res){
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    // res.setHeader("Content-Type", "text/html")

}).listen(8000)


console.log("server listening at port 3000");