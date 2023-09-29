const utils = require('../utils/coreUtils.js');
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

module.exports = {
    galleryUpload,
    clientUpload,
    isNotEmptyEnquire,
    enquires
}