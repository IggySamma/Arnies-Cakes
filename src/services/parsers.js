const utils = require('../utils/coreUtils.js');
const sqlQuery = require('./sql.js');
const serverConfig = require('../config/config.js');
const fs = require('fs');
const multer = require("multer");



const galleryUpload = multer({ 
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

function enquires(req, res){
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
    utils.sendEmails('2', adjData, textBody, photos);
    res.sendStatus(200);
};

let disabledDates = [{
    "ID": [],
    "Date": [],
    "IsRange": []
}];

function getDisabledDates(){
    disabledDates = [{
        "ID": [],
        "Date": [],
        "IsRange": []
    }];
    serverConfig.connection.query('SELECT * FROM disabledDates;', (error, result) => {
        if (error) {
            throw error;
        } else {}
            storeDisabledDates(JSON.parse(JSON.stringify(result)));
        }
    )
}

getDisabledDates();

function storeDisabledDates(data){
    let temp = data;
    for(let i = 0; i < data.length; i++){
        if(temp[i].IsRange === "Yes"){
            let tempObj = {
                "from": temp[i].Date.slice(0, 10),
                "to": temp[i].Date.slice(12, 22)
            }
            disabledDates[0].ID.push(temp[i].ID);
            disabledDates[0].Date.push(tempObj);
            disabledDates[0].IsRange.push(temp[i].IsRange);
        } else {
            disabledDates[0].ID.push(temp[i].ID);
            disabledDates[0].Date.push(temp[i].Date.slice(0, 10));
            disabledDates[0].IsRange.push(temp[i].IsRange);
        }
    }
    checkDates();
}

function checkDates(){
    let today = new Date().toJSON().slice(0, 10);
    for(let i = 0; i < disabledDates[0].ID.length; i++){
        if(disabledDates[0].IsRange[i] === "Yes") {
            if(today >= disabledDates[0].Date[i].to){
                deleteDates(disabledDates[0].ID[i]);
            }
        } else {
            if(today >= disabledDates[0].Date[i]){
                deleteDates(disabledDates[0].ID[i]);
            }
        }
    }
};

function deleteDates(ID){
    serverConfig.connection.query('DELETE FROM disabledDates WHERE ID= ?;', ID ,(error, result) => {
        if(result === undefined){
            res.json(new Error("Error rows is undefined"));
        }else{
            getDisabledDates();
    }})
}

module.exports = {
    galleryUpload,
    clientUpload,
    isNotEmptyEnquire,
    enquires,
    disabledDates
}