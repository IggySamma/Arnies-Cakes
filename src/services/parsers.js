const utils = require('../utils/coreUtils.js');
const globals = require('../globals/globals.js');
const sqlQuery = require('./sql.js');
const serverConfig = require('../config/config.js');
const fs = require('fs');
const multer = require("multer");
const { error } = require('console');
const { resourceLimits } = require('worker_threads');

/*------------------------------- Gallery ------------------------------------*/

function getAllFromGallery(){
    globals.gallery = new globals.galleryConstructor
    serverConfig.connection.query('SELECT * FROM GALLERY;',(error, result) => {
        if(result === undefined){
            res.json(new Error("Error rows is undefined"));
        }else{
            globals.gallery = JSON.parse(JSON.stringify(result));
    }}); 
}

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
            cb(new Error('Please upload an image of the correct format.'), false);
        }
            cb(undefined, true);
    },
});

/*------------------------------- Enquires ------------------------------------*/

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

function enquiresValidation(value1, value2){
    let emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let numberRegEx = /^[0-9]{10}$/

    return  value1.match(emailRegEx) === null ? "email" :
            value2.match(numberRegEx) === null ? "number" : "";
}

function enquires(req, res){
    let photos = req.files;
    let adjData = isNotEmptyEnquire(JSON.parse(JSON.stringify(req.body)));

    return enquiresValidation(adjData.email, adjData.number) === "email" ? res.sendStatus(405) : 
            enquiresValidation(adjData.email, adjData.number) === "number" ? res.sendStatus(406) : 
            photos === undefined ? res.sendStatus(407) : attachTextBody(adjData, photos, res)
};

function attachTextBody(adjData, photos, res){
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

}

/*------------------------------- Enquires Callender ------------------------------------*/



function getDisabledDates(){
    serverConfig.connection.query('SELECT * FROM disabledDates;', (error, result) => {
        if (error) {
            throw error;
        } else {}
            storeDisabledDates(JSON.parse(JSON.stringify(result)));
        }
    )
}

function storeDisabledDates(data){
    globals.disabledDates = new globals.disabledDatesContructor
    for(let i = 0; i < data.length; i++){
        if(data[i].IsRange === "Yes"){
            let tempObj = {
                "from": data[i].Date.slice(0, 10),
                "to": data[i].Date.slice(12, 22)
            }
            globals.disabledDates.ID.push(data[i].ID);
            globals.disabledDates.Date.push(tempObj);
            globals.disabledDates.IsRange.push(data[i].IsRange);
        } else {
            globals.disabledDates.ID.push(data[i].ID);
            globals.disabledDates.Date.push(data[i].Date.slice(0, 10));
            globals.disabledDates.IsRange.push(data[i].IsRange);
        }
    }
    checkDates();
}

function checkDates(){
    let today = new Date().toJSON().slice(0, 10);
    for(let i = 0; i < globals.disabledDates.ID.length; i++){
        if(globals.disabledDates.IsRange[i] === "Yes") {
            if(today >= globals.disabledDates.Date[i].to){
                deleteDates(globals.disabledDates.ID[i]);
            }
        } else {
            if(today >= globals.disabledDates.Date[i]){
                deleteDates(globals.disabledDates.ID[i]);
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

/*------------------------------- Bootup ------------------------------------*/

getDisabledDates();
getAllFromGallery();


module.exports = {
    galleryUpload,
    clientUpload,
    isNotEmptyEnquire,
    enquires
}