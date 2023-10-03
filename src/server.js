/*------------------ server Setup-----------------*/
const serverConfig = require('./config/config.js');
const parsers = require('./services/parsers.js');
const sqlQuery = require('./services/sql.js');
const utils = require('./utils/coreUtils.js');
const path = require('path');


serverConfig.app.listen(3000, () => {
    console.log(`server started...`);
});

//parsers.checkDisabledDates();

/*------------------ server API's to move-----------------*/

serverConfig.app.post('/api/gallery', (req, res) => { sqlQuery.getGallery(req, res) });

/*--------------------- Admin Page API's ---------------------*/

serverConfig.app.get('', function(req, res) { res.sendFile(path.join(__dirname, '/public/index.html'))});

serverConfig.app.get('/login', function(req, res) { res.sendFile(path.join(__dirname, '/admin/login.html')) });

serverConfig.app.post('/api/upload', parsers.galleryUpload.array("myFiles"), utils.uploadFiles);

serverConfig.app.post('/api/deleteGallery', (req, res) => { utils.deleteFromGallery(req, res) });

serverConfig.app.post('/api/adminGallery', (req, res) => { sqlQuery.getAllFromGallery(req, res) });


/*---------------------- Enquires API's -------------------------*/

/*
serverConfig.app.post('/api/deleteDates' , (req, res) => {  })*/

//serverConfig.app.post('/api/disabledDates', (req, res) => { sqlQuery.getDisabledDates(req, res) })

serverConfig.app.post('/api/disabledDates', (req, res) => { res.json(parsers.disabledDates)})

serverConfig.app.post('/api/getMainHeaders', (req, res) => { sqlQuery.getEnquiresMainHeaders(req, res) })

serverConfig.app.post('/api/getTreatsHeaders', (req, res) => { sqlQuery.getEnquiresSubHHeaders(req, res) })

serverConfig.app.post('/api/submitEnquire', parsers.clientUpload.array("clientPhotos"), (req, res) => { parsers.enquires(req,res) });