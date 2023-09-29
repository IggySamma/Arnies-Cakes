const serverConfig = require('../config/config.js');

function getGallery(req, res){
    let data = req.body
    if (data.sectionName === 'All') {
        serverConfig.connection.query('SELECT * FROM GALLERY;',(error, result) => {
            if(result === undefined){
                res.json(new Error("Error rows is undefined"));
            }else{
                var obj = JSON.parse(JSON.stringify(result));
                res.json(obj);
        }}); 
    } else {
        serverConfig.connection.query('SELECT * FROM gallery WHERE Type = ?;', data.sectionName,(error, result) => {
            if(result === undefined){
                res.json(new Error("Error rows is undefined"));
            }else{
                var obj = JSON.parse(JSON.stringify(result));
                res.json(obj);
        }});   
    }
};

function getAllFromGallery(req, res){
    let data = req.body
    serverConfig.connection.query('SELECT * FROM GALLERY;',(error, result) => {
        if(result === undefined){
            res.json(new Error("Error rows is undefined"));
        }else{
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
    }}); 
    res.sendStatus(200);
}

function getDisabledDates(req, res){
    serverConfig.connection.query('SELECT * FROM disabledDates;', (error, result) => {
        if (error) {
            throw error;
        } else {
            var obj = JSON.parse(JSON.stringify(result));
            console.log(obj)
            res.json(obj);
        }
    })
}

function getEnquiresMainHeaders(req, res){
    serverConfig.connection.query('SELECT * FROM mainHeaders;', (error, result) => {
        if (error) { 
            throw error; 
        } else {
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
        }
    })
    //res.sendStatus(200);
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
    //res.sendStatus(200);
}

module.exports = {
    getGallery,
    getAllFromGallery,
    getDisabledDates,
    getEnquiresMainHeaders,
    getEnquiresSubHHeaders
}