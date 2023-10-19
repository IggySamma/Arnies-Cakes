const serverConfig = require('../config/config.js');

/*------------------------------- Gallery ------------------------------------*/
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
    removeEnquire
}