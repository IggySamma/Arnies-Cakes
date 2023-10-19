const serverConfig = require('../config/config.js');

/*------------------------------- Gallery functions ----------------------------*/
function insertNewToGallery(newType, newPath) {
    let newImage = [
        Type = newType,
        Path = newPath,
    ];
    serverConfig.connection.query('INSERT INTO Gallery(Type, Path) Values(?, ?);', newImage,(error, res, fields) => {
        if (error) throw error;
     });
}

function deleteFromGalleryByID(data, res){
    serverConfig.connection.query('DELETE FROM Gallery WHERE ID= ?;', data.ID ,(error, result) => {
        if(result === undefined){
            res.json(new Error("Error rows is undefined"));
        }else{
            res.sendStatus(200);
    }})
}

/*------------------------------- Enquires ------------------------------------*/

/*--------------------------- Main Page Retrieve --------------------- */

function getEnquiresMainHeaders(req, res){
    serverConfig.connection.query('SELECT * FROM mainHeaders;', (error, result) => {
        if (error) { 
            throw error; 
        } else {
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
        }
    })
}

function getEnquiresSubHHeaders(req, res){
    serverConfig.connection.query('SELECT * FROM subHeaders;', (error, result) => {
        if (error) { 
            throw error; 
        } else {
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
        }
    })
}

/*--------------------------- Calender functions --------------------- */

function insertDisabledDate(req, res, Date, isRange){
    let updateData = [
        nDate = Date,
        nIsRange = isRange,
    ]
    serverConfig.connection.query('insert into disabledDates (Date, IsRange) values (?, ?);', updateData, (error, result) => {
        if (error) { 
            throw error; 
        } else {
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
        }
    })
}

function deleteDisabledDate(req, res, ID){
    serverConfig.connection.query('delete from disabledDates where ID=;', ID, (error, result) => {
        if (error) { 
            throw error; 
        } else {
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
        }
    })
}

/*--------------------------- Enquire functions --------------------- */

function storeEnquireLink(newDate, newLink){
    let storeLink = [
        date = newDate,
        Confirmed = "No",
        Link = newLink,
    ]
    serverConfig.connection.query('INSERT INTO enquires(Date, Confirmed, Link) Values(?, ?, ?)', storeLink, (error, result) => {
        if (error) { 
            throw error; 
        } else {
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
        }
    })
}

function retrieveEnquiresLink(req, res){
    serverConfig.connection.query('SELECT * FROM enquires;', (error, result) => {
        if (error) { 
            throw error; 
        } else {
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
        }
    })
}

function updateEnquiresConfirmed(req, res, ID, Date, Confirmed){
    let updateData = [
        ndate = Date,
        nConfirmed = Confirmed,
        nID = ID,
    ]
    serverConfig.connection.query('UPDATE enquires SET Date = ?, Confirmed = ? WHERE ID = ?;', updateData, (error, result) => {
        if (error) { 
            throw error; 
        } else {
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
        }
    })
}

function removeEnquire(req, res, ID){
    serverConfig.connection.query('delete from mainHeaders where ID=;', ID, (error, result) => {
        if (error) { 
            throw error; 
        } else {
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
        }
    })
}

module.exports = {
    getEnquiresMainHeaders,
    getEnquiresSubHHeaders,
    insertNewToGallery,
    deleteFromGalleryByID,
    storeEnquireLink,
    retrieveEnquiresLink,
    updateEnquiresConfirmed,
    removeEnquire,
    insertDisabledDate,
    deleteDisabledDate
}