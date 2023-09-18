require('dotenv').config();

/*-------------------Gmail Access setup -------------------------*/
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

/*----------------------------- MySQL Config ---------------------*/
let config = {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
};

/*------------------------------ MySQL Querys------------------*/
const mysql = require('mysql');
const connection = mysql.createConnection(config);

const insertToGallery = 'INSERT INTO Gallery(Type, Path) Values(?, ?);';
const selectAll = 'SELECT * FROM GALLERY;'
const selectByTypeFromGallery = "SELECT * FROM gallery WHERE Type = ?;";
const selectByID = "SELECT * FROM Gallery WHERE ID = ?;";
const deleteByIDFromGallery = "DELETE FROM Gallery WHERE ID= ?;";
const updateMainHeaderFlavoursByID = "UPDATE mainHeaders SET Flavours WHERE ID = ?";
const updateMinOrderQuantityByID = "UPDATE ? SET minOrder WHERE ID = ?";
const insetNewMainHeader = "";
const insertNewSubHeader = "";

/*------------------- Server Config ---------------------*/
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

const clientUpload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            cb(new Error('Please upload an image.'));
        }
            cb(undefined, true);
    },
});

/*------------------ Server Setup-----------------*/
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(express.static('/gallery/'));


app.listen(3000, () => {
    console.log(`Server started...`);
});

app.post('/api/gallery', (req, res) => {  
    let data = req.body
    if (data.sectionName === 'All') {
        connection.query('SELECT * FROM GALLERY;',(error, result) => {
            if(result === undefined){
                res.json(new Error("Error rows is undefined"));
            }else{
                var obj = JSON.parse(JSON.stringify(result));
                res.json(obj);
        }}); 
    } else {
        connection.query(selectByTypeFromGallery, data.sectionName,(error, result) => {
            if(result === undefined){
                res.json(new Error("Error rows is undefined"));
            }else{
                var obj = JSON.parse(JSON.stringify(result));
                res.json(obj);
        }});   
    }
});

/*--------------------- Admin Page API's ---------------------*/

app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, '/login.html'));
});

app.post('/api/upload', upload.array("myFiles"), uploadFiles);

function uploadFiles(req, res) {
    for (var i = 0; i < req.files.length; i++) {
        insertNewToGallery(req.body.name, "/gallery/" + req.files[i].filename);
    }
    res.sendStatus(200);
}

function insertNewToGallery(newType, newPath) {
    let newImage = [
        Type = newType,
        Path = newPath,
    ];
    connection.query(insertToGallery, newImage,(error, res, fields) => {
        if (error) throw error;
     });
}

app.post('/api/deleteGallery', (req, res) => {  
    let data = req.body;
    fs.unlink('./gallery/' + data.Path, (err) => {
    if (err) throw err;
    });
    connection.query('DELETE FROM Gallery WHERE ID= ?;', data.ID ,(error, result) => {
        if(result === undefined){
            res.json(new Error("Error rows is undefined"));
        }else{
            /*var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);*/
            res.sendStatus(200);
    }});

});

app.post('/api/adminGallery', (req, res) => {  
    let data = req.body
    connection.query('SELECT * FROM GALLERY;',(error, result) => {
        if(result === undefined){
            res.json(new Error("Error rows is undefined"));
        }else{
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
    }}); 
});


/*---------------------- Enquires API's -------------------------*/

app.get('/api/disabledDates', (req, res) => {
    connection.query('SELECT * FROM disabledDates;', (error, result) => {
        if (error) {
            throw error;
        } else {
            res.json(res);
        }
    })
})

app.post('/api/getMainHeaders', (req, res) => {
    connection.query('SELECT * FROM mainHeaders;', (error, result) => {
        if (error) { 
            throw error; 
        } else {
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
        }
    })
})

app.post('/api/getTreatsHeaders', (req, res) => {
    connection.query('SELECT * FROM subHeaders;', (error, result) => {
        if (error) { 
            throw error; 
        } else {
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
        }
    })
})

app.post('/api/submitEnquire', clientUpload.array("clientPhotos"), (req, res) => {
    let data = JSON.parse(JSON.stringify(req.body));
    let photos = req.files;
    let adjData = isNotEmptyEnquire(data);
    let textBody = ""; 

    for(let i = 0; i < Object.keys(adjData).length; i++){
        if(Object.keys(adjData)[i] !== 'fullName' && Object.keys(adjData)[i] !== 'email' && Object.keys(adjData)[i] !== 'number' && Object.keys(adjData)[i] !== 'datetime'){
            let temp = "";                
            let j = 0;
            do {
                if(Object.keys(adjData)[i][j].toUpperCase() === Object.keys(adjData)[i][j]){
                    temp = temp + ' ' + Object.keys(adjData)[i][j];
                } else {
                    temp = temp + Object.keys(adjData)[i][j];
                }
                j++;
            } while (j < Object.keys(adjData)[i].length);
            textBody = textBody + "<p>" + temp + ": " + Object.values(adjData)[i] + "</p>";
        };
    }
    /* ---------VV ------------- Create function to retrieve enquire ID and store Enquire ? -----------*/
    sendEmails('2', adjData, textBody, photos);
    res.sendStatus(200);
});

function isNotEmptyEnquire(data){
    let adjData = {};
    for (var i = 0; i < Object.keys(data).length; i++) {
        if (Object.values(data)[i] != "" && Object.values(data)[i] != "0") {
                //adjData[Object.keys(data)[i].replace('CheckBox1','').replace('Input','')/*.charAt(0).toUpperCase()*/ + Object.keys(data)[i].replace('CheckBox1','').replace('Input','')/*.slice(1).toLowerCase()*/] = Object.values(data)[i];
                adjData[Object.keys(data)[i].replace('CheckBox1','').replace('Input','')] = Object.values(data)[i];
        }
    };
    return adjData;
};

function sendEmails(enqNum, data, textBody, photos){
    const enquireToSelf = {
        from: "arniescakes@gmail.com",
        to: "arniescakes@gmail.com",
        subject: "Enquire: Number - " + enqNum,
        generateTextFromHTML: true,
        html: '<div style="margin:auto; padding:auto; position: relative; height: 300px; width: 300px;"><img src="cid:logo" style="height: 300px; width: 300px;"></div><div style="margin:auto; padding: 3px 3px 3px 3px; text-align: center; position: relative; top: 220px; height: auto; background-color: #D3BBDD; border-radius: 8px;"><p>Name: ' + data.fullName + '</p><p>Email: ' + data.email + '</p><p>Number: ' + data.number + '</p><p>Date: ' + data.datetime + '</p><p>' + textBody + '</p></div>',    
        attachments: [{
            filename: photos[0].originalname, 
            content: photos[0].buffer, 
        },
        {
            filename: "Logo.png",
            path: "./index images/home logo.png",
            cid: "logo"
        }
        ],
    };

    emailTransporter.sendMail(enquireToSelf, (error, response) => {
        error ? console.log(error) : emailTransporter.close();
    });

    const enquireToClient = {
        from: "arniescakes@gmail.com",
        to: data.email,
        subject: "Arnies Cakes Enquire: Number - " + enqNum,
        generateTextFromHTML: true,
        html: '<div style="margin:auto; padding:auto; position: relative; height: 300px; width: 300px;"><img src="cid:logo" style="height: 300px; width: 300px;"></div><div style="margin:auto; padding: 3px 3px 3px 3px; text-align: center; position: relative; top: 220px; height: auto; background-color: #D3BBDD; border-radius: 8px;"><p>Name: ' + data.fullName + '</p><p>Email: ' + data.email + '</p><p>Number: ' + data.number + '</p><p>Date: ' + data.datetime + '</p><p>' + textBody + '</p></div>',
        attachments: [{
            filename: photos[0].originalname,
            content: photos[0].buffer,
        },
        {
            filename: "Logo.png",
            path: "./index images/home logo.png",
            cid: "logo"
        }],
    };

    emailTransporter.sendMail(enquireToClient, (error, response) => {
        error ? console.log(error) : emailTransporter.close();
    });
};



function getEmailID(auth, query){  
  return new Promise((resolve, reject) => {    
    const gmail = google.gmail({version: 'v1', auth});    
    gmail.users.messages.list(      
      {        
        userId: 'me',        
        q: query,      
      },(err, res) => {        
        if (err) {
            reject(err);          
            return;        
        }        
        if (!res.data.messages) {
            resolve([]);          
            return;        
        }
        resolve(res.data.messages);      
      })})
}

/*---------------VVV Not finished Just pulls link doesn't store------------ */
function storeEmailLinkToDB(){
    let messageID = getEmailID(oauth2Client, 'label:inbox subject:Enquire: Number - 2');
    messageID.then(data => {
    console.log("https://mail.google.com/mail?authuser=arniescakes@gmail.com#all/" + data[0].id);
})
}

