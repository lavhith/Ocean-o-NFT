//Imports for Express
const express = require('express');
let webApp = new express();
let hostPort = 3000;

webApp.listen(hostPort, (err)=> {
    if (err) throw err;
    console.log('Running on port : '+hostPort);
})

//webApp.use(express.static('C:\\Users\\vansh\\Documents\\College\\Sem VI\\WT\\WT-Project'))
webApp.use(express.static('main'))

//Imports for Mongo
const mongoClient = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://localhost:27017/wtproject';
let dbo;

//Imports for FS
const fs = require('fs');


//Imports for Formidable
const formidable = require('formidable');


//Imports for body-parser
const bodyParser = require('body-parser');
webApp.use(bodyParser.urlencoded({extended: true}));
webApp.use(bodyParser.json())

/**********************Upload to Server**********************/

webApp.post('/uploadFile', (req, res)=>{
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files)=>{
        let oldPath = files.uploadToFile.filepath;
        let path = __dirname + '\\main\\img\\'
        console.log(path)
        let newPath = path + files.uploadToFile.originalFilename;
        fs.rename(oldPath, newPath, function (err) {
            if (err){
                console.log('Failed')
            }
            console.log('File uploaded and moved!');
        });
    })
})

webApp.post('/uploadForm',(req, res)=>{
    mongoClient.connect(mongoUrl, (err, db)=>{
        if(err) throw err;
        dbo = db.db('wtproject');
        console.log(req.body)
        let data = req.body;

        dbo.collection('NFT').insertOne(data,(err, results) =>{
            if (err) throw (err)
            else{
                console.log(results)
            }
        });
    })
})

/**********************Mongo to REST**********************/

//Get NFT Function
webApp.get('/getNftData', (req, res) =>{
    mongoClient.connect(mongoUrl, (err, db)=>{
        if(err) throw err;
        dbo = db.db('wtproject');
        dbo.collection('NFT').find().toArray((err, result)=>{
            res.send(result);
        })
    })
})

//Get Single NFT
webApp.post('/getNFT', (req,res)=>{
    mongoClient.connect(mongoUrl,(err,db)=> {
        if (err) throw err;
        dbo = db.db('wtproject');

        let data = req.body
        dbo.collection('NFT').findOne({NFT_Collection_Name:data.NFT_Collection_Name},{}, (err, results)=>{
            if (err) throw err;
            res.send(results)
        })
    })
})

//Get NFT Low
webApp.get('/getNftLowest', (req, res) =>{
    mongoClient.connect(mongoUrl, (err, db)=>{
        if(err) throw err;
        dbo = db.db('wtproject');
        dbo.collection('NFT').find().sort({NFT_Top_Bid_Amount:1}).collation({locale:'en_US',numericOrdering: true}).toArray((err, result)=>{
            res.send(result);
        })
    })
})

//Get NFT High
webApp.get('/getNftHighest', (req, res) =>{
    mongoClient.connect(mongoUrl, (err, db)=>{
        if(err) throw err;
        dbo = db.db('wtproject');
        dbo.collection('NFT').find().sort({NFT_Top_Bid_Amount:-1}).collation({locale:'en_US',numericOrdering: true}).toArray((err, result)=>{
            res.send(result);
        })
    })
})

//Get NFT name asc
webApp.get('/getNftNameF', (req, res) =>{
    mongoClient.connect(mongoUrl, (err, db)=>{
        if(err) throw err;
        dbo = db.db('wtproject');
        dbo.collection('NFT').find().sort({NFT_Collection_Name:1}).toArray((err, result)=>{
            res.send(result);
        })
    })
})

//Get NFT name desc
webApp.get('/getNftNameL', (req, res) =>{
    mongoClient.connect(mongoUrl, (err, db)=>{
        if(err) throw err;
        dbo = db.db('wtproject');
        dbo.collection('NFT').find().sort({NFT_Collection_Name:-1}).toArray((err, result)=>{
            res.send(result);
        })
    })
})


//Sign Up Function
webApp.post('/createAccount',(req, res)=>{
    mongoClient.connect(mongoUrl, (err, db)=>{
        if(err) throw err;
        dbo = db.db('wtproject');
        console.log(req.body)
        let data = req.body;
        console.log(data.Password)
        console.log('Function Called')

        dbo.collection('users').insertOne(data,(err, results) =>{
            if (err) {
                res.send('ERR420')
            }
            else{
                res.send('')
                console.log("Record inserted Successfully");
            }
        });
    })
})

//Sign In Function
webApp.post('/loginAccount', (req, res)=>{
    mongoClient.connect(mongoUrl, (err, db)=> {
        if (err) throw err;
        dbo = db.db('wtproject');
        console.log(req.body)
        let data = req.body;
        if (JSON.stringify(data) != '{}'){
            dbo.collection('users').findOne({$and:[{Email:data.Email}, {Password:data.Password}]},{},(err, results)=>{
                console.log('Sent')
                console.log(results)
                res.send(results);
            })
        }
        else {
            res.send('');
        }
    })
})


//Update Balance
webApp.post('/updateBalance',(req,res)=>{
    mongoClient.connect(mongoUrl,(err,db)=> {
        if (err) throw err;
        dbo = db.db('wtproject');

        let data = req.body
        dbo.collection('users').updateOne({Email:data.Email},{$set:{'Balance':data.Balance}}, (err, results)=>{
            if (err) throw err;
            res.send(true)
            console.log(results)
        })
    })
})

//Update Details
webApp.post('/updateDetails',(req,res)=>{
    mongoClient.connect(mongoUrl,(err,db)=> {
        if (err) throw err;
        dbo = db.db('wtproject');

        let data = req.body
        console.log(data)
        dbo.collection('users').updateOne({'Email':data.Email},{$set:{'Username':data.updatedUsername, 'Email':data.updatedEmail, 'Bio':data.updatedBio}}, (err, results)=>{
            if (err) {
                res.send(false)
            }
            else{
                dbo.collection('NFT').updateMany({'NFT_Owner_Name':data.Username},{$set:{'NFT_Owner_Name':data.updatedUsername}}, (err, results)=>{
                    console.log(results)
                })
                res.send(true)
            }
            console.log(results)
        })
    })
})

//Get User
webApp.post('/getUser', (req,res)=>{
    mongoClient.connect(mongoUrl,(err,db)=> {
        if (err) throw err;
        dbo = db.db('wtproject');

        let data = req.body
        dbo.collection('users').findOne({Email:data.updatedEmail},{}, (err, results)=>{
            if (err) throw err;
            res.send(results)
        })
    })
})

//Place a Bid
webApp.post('/placeBid', (req,res)=>{
    mongoClient.connect(mongoUrl,(err,db)=> {
        if (err) throw err;
        dbo = db.db('wtproject');

        let data = req.body
        console.log(data)
        dbo.collection('users').updateOne({Email:data.Email},{$set:{Balance:data.Balance}}, (err, results)=>{
            if (err) throw err;
            console.log(results)
        })

        console.log(data.NFT_Collection_Name)
        console.log(data.NFT_Top_Bid_Amount)
        console.log(data.NFT_Current_Bidder)

        dbo.collection('NFT').updateOne({'NFT_Collection_Name':data.NFT_Collection_Name},{$set:{'NFT_Top_Bid_Amount':data.NFT_Top_Bid_Amount, 'NFT_Current_Bidder':data.NFT_Current_Bidder}}, (err, results)=>{
            if (err) throw err;
            console.log(results)
        })
        res.send(true)
    })
})

//Buy Out
webApp.post('/buyOut', (req,res)=>{
    mongoClient.connect(mongoUrl,(err,db)=> {
        if (err) throw err;
        dbo = db.db('wtproject');

        let data = req.body
        console.log(data)

        dbo.collection('NFT').updateOne({'NFT_Collection_Name':data.NFT_Collection_Name},{$set:{'NFT_Owner_Name':data.Username, 'isOnSale':false}}, (err, results)=>{
            if (err) throw err;
            console.log(results)
        })
        res.send(true)
    })
})