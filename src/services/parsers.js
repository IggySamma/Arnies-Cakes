const utils = require('../utils/coreUtils.js');
const globals = require('../globals/globals.js');
const sqlQuery = require('./sql.js');
const serverConfig = require('../config/config.js');
const fs = require('fs');
const multer = require("multer");

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
    //console.log("Data: ", data)
    for (var i = 0; i < Object.keys(data).length; i++) {
        /*if(Object.keys(data)[i] == "Order"){

            const orderList = Object.values(data)[i]

            orderList.forEach(order => {
                const orderObj = JSON.parse(order)
                for (const [key, value] of Object.entries(orderObj)){
                    console.log(key, value)
                    //adjData.push(key:value)
                }
            })




            //console.log(JSON.parse(Object.values(data)[i]))  
        }*/
        if (Object.values(data)[i] != "" && Object.values(data)[i] != "0") {
                //adjData[Object.keys(data)[i].replace('CheckBox1','').replace('Input','')/*.charAt(0).toUpperCase()*//* + Object.keys(data)[i].replace('CheckBox1','').replace('Input','')/*.slice(1).toLowerCase()*//*] = Object.values(data)[i];
                //adjData[Object.keys(data)[i].replace('CheckBox1','').replace('Input','')] = Object.values(data)[i];
                adjData[Object.keys(data)[i]] = Object.values(data)[i];
                //adjData.push(Object.keys(data)[i]:Object.values(data)[i])
        }
       //console.log("Key: ", Object.keys(data)[i], " Value: ", Object.values(data)[i])
        
    };
    return adjData;
};

function enquiresValidation(value1, value2){
    let emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let numberRegEx = /^(?:08\d{8}|\+3538\d{8})$/;

    return  value1.match(emailRegEx) === null ? "email" :
            value2.match(numberRegEx) === null ? "number" : "";
}

function enquires(req, res){
    let photos = req.files;
    
    //console.log("Raw: ", JSON.parse(JSON.stringify(req.body)));

    let adjData = isNotEmptyEnquire(JSON.parse(JSON.stringify(req.body)));

    //console.log(adjData);

    //return res.sendStatus(500);

    return enquiresValidation(adjData.Email, adjData.Number) === "email" ? res.sendStatus(405) : 
            enquiresValidation(adjData.Email, adjData.Number) === "number" ? res.sendStatus(406) : 
            photos === undefined ? res.sendStatus(407) : attachTextBody(adjData, photos, res);
};

function attachTextBody(adjData, photos, res){
    let textBody = ""; 
    let date = ""

    if("Date of Collection" in adjData){
        date = adjData["Date of Collection"]
    } else if("Date of Delivery" in adjData){
        date = adjData["Date of Delivery"]
    }
    /*for(let i = 0; i < Object.keys(adjData).length; i++){
        if(Object.keys(adjData)[i] === 'datetime'){
            date = Object.values(adjData)[i]
        }
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
    }*/

    for (let i = 0; i < Object.keys(adjData).length; i++) {
        if(Object.keys(adjData)[i] == "Order"){

            const orderList = Object.values(adjData)[i]

            orderList.forEach(order => {
                const orderObj = JSON.parse(order)
                for (const [key, value] of Object.entries(orderObj)){
                    //console.log(key, value)
                    //adjData.push(key:value)
                    textBody = textBody + "<p>" + key + ": " + value + "</p>";
                }
            }) 
        } else {
            textBody = textBody + "<p>" + Object.keys(adjData)[i] + ": " + Object.values(adjData)[i] + "</p>";
        }
    }

    sqlQuery.storeNewEnquire(res, sqlQuery.getAllEnquires).then(ID => {
        utils.sendEmails(ID[ID.length -1].ID, adjData, textBody, photos, res, date);
    })
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
    console.log("Disabled dates checked")
    console.log("Disabled dates stored")
    checkMinimumDate()
}

function checkDates(){
    let today = new Date(new Date().setDate(new Date().getDate() /* + 3 */)).toISOString().split('T')[0];
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
    console.log("Disabled dates cleaned up")
};

function deleteDates(ID){
    serverConfig.connection.query('DELETE FROM disabledDates WHERE ID= ?;', ID ,(error, result) => {
        if(result === undefined){
            res.json(new Error("Error rows is undefined"));
        }else{
            getDisabledDates();
    }})
    console.log("Deleted old disabled date ID: " + ID)
}

function checkMinimumDate(){
    let minDate = new Date(new Date().setDate(new Date().getDate() + 3 )).toISOString().split('T')[0]
    let i = 0
    let usedDates = []

    for(let i = 0; i < globals.disabledDates.ID.length; i++){
        globals.disabledDates.IsRange[i] === "Yes" ? 
        createDateArrayFromDateRanges(globals.disabledDates.Date[i].from, globals.disabledDates.Date[i].to).forEach((day) => {usedDates.push(day)}) :
        usedDates.push(globals.disabledDates.Date[i]);
    }

    while(usedDates.includes(minDate) === true){
        minDate = new Date(new Date().setDate(new Date().getDate() + 3 + i)).toISOString().split('T')[0]
        i++
    }
    globals.disabledDates.MinDate = minDate
    console.log("Min Date for disabled dates set as: " + minDate)
}

function createDateArrayFromDateRanges(fromString, toString){
    let i = -1
    let from = new Date(new Date(fromString).setDate(new Date(fromString).getDate())).toISOString().split('T')[0]
    let to = new Date(new Date(toString).setDate(new Date(toString).getDate())).toISOString().split('T')[0]
    let dateRange = []
    while(from < to){
        i++
        from = new Date(new Date(fromString).setDate(new Date(fromString).getDate() + i)).toISOString().split('T')[0]
        dateRange.push(from)
    }
    return dateRange
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