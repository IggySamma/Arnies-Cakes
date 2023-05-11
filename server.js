const express = require('express');
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

const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));



app.listen(3000, () => {
    console.log(`Server started...`);
});

app.post('/api/upload', upload.array("myFiles"), uploadFiles);

function uploadFiles(req, res) {
    for (var i = 0; i < req.files.length; i++) {
        insertNewToGallery(req.body.name, "./gallery/" + req.files[i].filename + req.files[i].mimetype.replace('image/', '.'));
    }
    //console.log(req.body.name);
    //console.log(req.files)
    //console.log(req.body);
    //console.log(req.files);
    //res.json({ message: "Successfully uploaded files" });
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

app.get('/api/gallery', function(req, res){
    return new Promise((resolve, reject) => {
        connection.query(selectAll,(error, result) => {
            if (error) reject(error);
            console.log(JSON.parse(JSON.stringify(result)));
            resolve(JSON.parse(JSON.stringify(result)));
        })
    });
});