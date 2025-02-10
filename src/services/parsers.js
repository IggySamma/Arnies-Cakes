const utils = require('../utils/coreUtils.js');
const globals = require('../globals/globals.js');
const sqlQuery = require('./sql.js');
const serverConfig = require('../config/config.js');
const fs = require('fs');
const multer = require("multer");
const { text } = require('body-parser');

/*------------------------------- Gallery ------------------------------------*/

/*------------------------------- MySql ----------------------------*/
/*
function getAllFromGallery(){
    globals.gallery = new globals.galleryConstructor
    serverConfig.connection.query('SELECT * FROM GALLERY ORDER BY ID ASC;',(error, result) => {
        
    }}); 
}*/

/*------------------------------- MySql2 ----------------------------*/

function getAllFromGallery(){
    globals.gallery = new globals.galleryConstructor

    serverConfig.connection.execute(
        'SELECT * FROM GALLERY ORDER BY ID ASC;',
        function (err, results) {
            if(err){
                res.json(new Error(err));
            }else{
                globals.gallery = JSON.parse(JSON.stringify(results));
            }
        }
    );
}

const galleryUpload = multer({ 
    dest: "./public/gallery",
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

/*------------------------------- Enquiries ------------------------------------*/

function isNotEmptyEnquirie(data){
    let adjData = {};
    for (var i = 0; i < Object.keys(data).length; i++) {
        if (Object.values(data)[i] != "" && Object.values(data)[i] != "0") {
            adjData[Object.keys(data)[i]] = Object.values(data)[i];         
        }
    };
    return adjData;
};

function EnquiriesValidation(value1, value2){
    let emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let numberRegEx = /^(?:08\d{8}|\+3538\d{8})$/;

    return  value1.match(emailRegEx) === null ? "email" :
            value2.match(numberRegEx) === null ? "number" : "";
}

function Enquiries(req, res){
    let photos = req.files;
    
    let adjData = isNotEmptyEnquirie(JSON.parse(JSON.stringify(req.body)));

    return EnquiriesValidation(adjData.Email, adjData.Number) === "email" ? res.sendStatus(405) : 
            EnquiriesValidation(adjData.Email, adjData.Number) === "number" ? res.sendStatus(406) : 
            photos === undefined ? res.sendStatus(407) : attachTextBody(adjData, photos, res);
};

function attachTextBody(adjData, photos, res){
    let textBody = ""; 
    let date = ""
    let start = false;
    let finish = false;

    let tableHeader = {
        "Item": "Item",
        "Quantity": "Quantity",
        "Flavour": "Flavour",
        "Cake Size": "Cake Size",
    }
    let tableData = {
        "Item": [],
        "Quantity": [],
        "Flavour": [],
        "Cake Size": [],
    }

    if("Date of Collection" in adjData){
        date = adjData["Date of Collection"]
    } else if("Date of Delivery" in adjData){
        date = adjData["Date of Delivery"]
    }

    //console.log("AdjData:  " + adjData);
    
    for (let i = 0; i < Object.keys(adjData).length; i++) {
        if(Object.keys(adjData)[i] == "Order"){

            const orderList = Object.values(adjData)[i]
            Object.values(orderList).forEach(order => {
                const orderObj = JSON.parse(order)
                for (const [key, value] of Object.entries(orderObj)){
                    //console.log("Key to test: " + key + " Value: " + value);
                    if(key in tableData){
                        finish = false;
                        start = true;
                        tableData[key].push(value);
                    }
                    finish = true;
                }
            })
            if (start && finish) {
                let activeKeys = Object.keys(tableData).filter(key => tableData[key].length > 0);
                const maxLength = Math.max(...activeKeys.map(key => tableData[key].length));
                //console.log(activeKeys);
                //console.log(maxLength);
                textBody = textBody + '<table>';

                
                for (const key of Object.keys(activeKeys)) {
                    //console.log(Object.keys(tableHeader)[key])
                    //textBody += '<th>' + (tableHeader[key] || "") + '</th>';
                    textBody += '<th>' + Object.keys(tableHeader)[key] + '</th>';
                    //console.log("Header: " + key);
                }
                

                /*console.log(Object.values(tableData))
                console.log(Object.values(tableData).length)*/

                /*for (let i = 0; i < maxLength; i++) {
                    textBody += '<th>' + Object.keys(tableHeader)[i] + '</th>';
                }*/
                
                for (let i = 0; i < maxLength; i++) {
                    textBody += '<tr>';
                    for (const key of activeKeys) {
                        textBody += '<td>' + (tableData[key][i] || "") + '</td>';
                        //console.log("TD: " + key, " value: " + tableData[key][i]);
                    }
                    textBody += '</tr>';
                }
                textBody += '</table>';
                //console.log("after orer added: " + textBody);
            }
            //console.log("I ran here")
        } else {
            textBody += "<p><strong>" + Object.keys(adjData)[i] + ":</strong> " + Object.values(adjData)[i] + "</p>";
        }
    }

    sqlQuery.storeNewEnquirie(res, sqlQuery.getAllEnquiries).then(ID => {
        utils.sendEmails(ID[ID.length -1].ID, adjData, textBody, photos, res, date);
    })
}
/*------------------------------- Flavours ------------------------------------*/
/*------------------------------- MySql ----------------------------*/
/*
function getFlavours(){
    serverConfig.connection.query('SELECT * FROM flavours;', (error, result) => {
        if (error) {
            throw error;
        } else {
            storeFlavours(JSON.parse(JSON.stringify(result)));
        }
    })
}*/

/*------------------------------- MySql2 ----------------------------*/


function getFlavours(){
   serverConfig.connection.execute(
        'SELECT * FROM flavours;',
        function (err, results) {
            if (err) {
                console.log(err);
            } else {
                storeFlavours(JSON.parse(JSON.stringify(results)));
            }
        }
   );
}

function storeFlavours(data){
    globals.flavours = new globals.flavoursConstructor;

    const re = new RegExp(/["\[\]]|null/g)

    for(let i = 0; i < data.length; i++){
        globals.flavours.ID.push(data[i].ID);
        globals.flavours.Heading.push(data[i].Heading);
        globals.flavours.Type.push(String(data[i].Type).replace(re,"").split(","));
        globals.flavours.Text.push(String(data[i].Text).replace(re,"").split(","));
        globals.flavours.Flavours.push(String(data[i].Flavours).replace(re,"").split(","));
    }

    console.log("Flavours stored");
}

/*------------------------------- Enquiries Callender ------------------------------------*/

/*------------------------------- MySql ----------------------------*/
/*
function getDisabledDates(){
    serverConfig.connection.query('SELECT * FROM disabledDates;', (error, result) => {
        if (error) {
            throw error;
        } else {
            storeDisabledDates(JSON.parse(JSON.stringify(result)));
        }
    });
}
*/
/*------------------------------- MySql2 ----------------------------*/

function getDisabledDates(){
   serverConfig.connection.execute(
        'SELECT * FROM disabledDates;',
        function (err, results) {
            if (err) {
                console.log(err)
            } else {
                storeDisabledDates(JSON.parse(JSON.stringify(results)));
            }
        }
   );
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

/*------------------------------- MySql ----------------------------*/
/*
function deleteDates(ID){
    serverConfig.connection.query('DELETE FROM disabledDates WHERE ID= ?;', ID ,(error, result) => {
        if(result === undefined){
            res.json(new Error("Error rows is undefined"));
        }else{
            getDisabledDates();
    }})
    console.log("Deleted old disabled date ID: " + ID)
}*/

/*------------------------------- MySql2 ----------------------------*/
function deleteDates(ID){
    serverConfig.connection.execute(
        'DELETE FROM disabledDates WHERE ID= ?;', 
        [ID],
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                getDisabledDates();
                console.log("Deleted old disabled date ID: " + ID);
            }
        }
    );
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
getFlavours();

module.exports = {
    galleryUpload,
    clientUpload,
    isNotEmptyEnquirie,
    Enquiries
}