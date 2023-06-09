require('dotenv').config();

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID, // ClientID
    process.env.GMAIL_CLIENT_SECRET, // Client Secret
    "https://developers.google.com/oauthplayground/" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});
const accessToken = oauth2Client.getAccessToken()


let emailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
            type: "OAuth2",
            user: process.env.GMAIL_USER, 
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            accessToken: accessToken
    },
    tls: {
        rejectUnauthorized: false
    },
});

const mailOptions = {
    from: "arniescakes@gmail.com",
    to: "ignasfb@yahoo.ie",
    subject: "Node.js Email with Secure OAuth",
    generateTextFromHTML: true,
    html: "<b>test</b>"
};

emailTransporter.sendMail(mailOptions, (error, response) => {
    error ? console.log(error) : console.log(response);
    emailTransporter.close();
});

let config = {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
};

const fs = require('fs');
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

const upload1 = multer();

const mysql = require('mysql');

const connection = mysql.createConnection(config);
const insert = 'INSERT INTO Gallery(Type, Path) Values(?, ?);';
const selectAll = 'SELECT * FROM gallery;'
const selectByType = "SELECT * FROM gallery WHERE Type = ?;";
const selectByID = "SELECT * FROM Gallery WHERE ID = ?;";
const deleteByID = "DELETE FROM Gallery WHERE ID= ?;";

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
        insertNewToGallery(req.body.name, "/gallery/" + req.files[i].filename);
    }
}

app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, '/login.html'));
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

app.post('/api/gallery', (req, res) => {  
    let data = req.body
    if (data.sectionName === 'All') {
        connection.query(selectAll,(error, result) => {
            if(result === undefined){
                res.json(new Error("Error rows is undefined"));
            }else{
                var obj = JSON.parse(JSON.stringify(result));
                res.json(obj);
        }}); 
    } else {
        connection.query(selectByType, data.sectionName,(error, result) => {
            if(result === undefined){
                res.json(new Error("Error rows is undefined"));
            }else{
                var obj = JSON.parse(JSON.stringify(result));
                res.json(obj);
        }});   
    }
});

app.post('/api/deleteGallery', (req, res) => {  
    let data = req.body;
    fs.unlink('./gallery/' + data.Path, (err) => {
    if (err) throw err;
    });
    connection.query(deleteByID, data.ID ,(error, result) => {
        if(result === undefined){
            res.json(new Error("Error rows is undefined"));
        }else{
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
    }});
});

app.post('/api/adminGallery', (req, res) => {  
    let data = req.body
    connection.query(selectAll,(error, result) => {
        if(result === undefined){
            res.json(new Error("Error rows is undefined"));
        }else{
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
    }}); 
});

app.post('/api/submitEnquire', upload.array(), (req, res) => {
    let data = req.body;
    console.log(data);
    sendEmail();
});

async function sendEmail(){
    emailTransporter.sendMail({
        from: "arniescakes@gmail.com",
        to: "ignasfb@yahoo.ie",
        subject: "Message",
        text: "I hope this message gets through!",
    });
};

