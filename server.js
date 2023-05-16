const express = require('express');
const bodyParser = require('body-parser');
const JSONParser = bodyParser.json();
const app = express();

const multer = require("multer");
const upload = multer({ 
    dest: "./gallery",
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            cb(new Error('Please upload an image.'));
        }
            cb(undefined, true);
    },
});


const mysql = require('mysql');
const config = require('./bin/config.js');


const connection = mysql.createConnection(config);
const insert = 'INSERT INTO Gallery(Type, Path) Values(?, ?);';
const selectAll = 'SELECT * FROM gallery;'
const selectByType = 'SELECT ? FROM gallery;'

const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(express.static('/gallery/'));



app.listen(3000, () => {
    console.log(`Server started...`);
});

app.post('/api/upload', upload.array("myFiles"), uploadFiles);

function uploadFiles(req, res) {
    for (var i = 0; i < req.files.length; i++) {
        //insertNewToGallery(req.body.name, "./gallery/" + req.files[i].filename + req.files[i].mimetype.replace('image/', '.'));
        insertNewToGallery(req.body.name, "/gallery/" + req.files[i].filename);
    }
}

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/adminindex.html'));
});

function insertNewToGallery(newType, newPath) {
    let newImage = [
        Type = newType,
        Path = newPath,
    ];
    connection.query(insert, newImage,(error, res, fields) => {
        if (error) throw error;
     });
}

app.post('/api/gallery', JSONParser, (req, res) => {  
    console.log(req.body);
    connection.query(selectAll,(error, result) => {
        if(result === undefined){
            res.json(new Error("Error rows is undefined"));
        }else{
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
    }}); 
});
