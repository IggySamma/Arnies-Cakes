/*------------------ Server Setup-----------------*/

const globals = require('./globals/globals.js');
const serverConfig = require('./config/config.js');
const parsers = require('./services/parsers.js');
const sqlQuery = require('./services/sql.js');
const utils = require('./utils/coreUtils.js');
const path = require('path');
const server = serverConfig.app

server.listen(3000, () => {
    console.log(`Server started...`);
});

/*------------------ Front Page -----------------*/

server.get('', function(req, res) { res.sendFile(path.join(__dirname, '/public/Index.html'))});
server.get('/index', function(req, res) { res.sendFile(path.join(__dirname, '/public/Index.html'))});
server.get('/about', function(req, res) { res.sendFile(path.join(__dirname, '/public/About.html'))});
server.get('/gallery', function(req, res) { res.redirect('../Gallery.html?type=All')});
server.get('/flavours', function(req, res) { res.sendFile(path.join(__dirname, '/public/Flavours.html'))});
server.get('/enquiries', function(req, res) { res.sendFile(path.join(__dirname, '/public/Enquiries.html'))});
server.get('/enquiriesty', function(req, res) { res.sendFile(path.join(__dirname, '/public/EnquiriesTY.html'))});
server.get('/tests/email', function(req, res) { res.sendFile(path.join(__dirname, '/tests/sendEmail.html'))});

/*------------------ Front API's -----------------*/

server.post('/api/gallery', (req, res) => { utils.filterGallery( req, res) });
server.get('/api/flavours', (req, res) => { res.json(globals.flavours) });
server.post('/api/disabledDates', (req, res) => { res.json(globals.disabledDates)})
server.post('/api/getMainHeaders', (req, res) => { sqlQuery.getEnquiriesMainHeaders(req, res) })
server.post('/api/getTreatsHeaders', (req, res) => { sqlQuery.getEnquiriesSubHHeaders(req, res) })
server.post('/api/submitEnquirie', parsers.clientUpload.array("clientPhotos"), (req, res) => { parsers.Enquiries(req, res)});

/*--------------------- Admin Page API's ---------------------*/

server.post('/api/upload', serverConfig.ensureAuthenticated, parsers.galleryUpload.array("myFiles"), (req, res) => { parsers.uploadFiles(req, res) });
server.post('/api/deleteGallery', serverConfig.ensureAuthenticated, (req, res) => { parsers.deleteFromGallery(req, res) });
server.post('/api/adminGallery', serverConfig.ensureAuthenticated, (req, res) => { utils.filterGallery(req, res) });
server.post('/api/allEnquiries', serverConfig.ensureAuthenticated , (req, res) => { sqlQuery.getAllEnquiries().then(data => res.json(data)) });
server.post('/api/allConfirmedEnquiries', serverConfig.ensureAuthenticated , (req, res) => { sqlQuery.getAllConfirmedEnquiries().then(data => res.json(data)) });
server.post('/api/confirmEnquiry', serverConfig.ensureAuthenticated , (req, res) => { sqlQuery.confirmEnquiry(req, res) });
server.post('/api/declineEnquiry', serverConfig.ensureAuthenticated , (req, res) => { sqlQuery.declineEnquiry(req, res) });
server.post('/api/deleteEnquiry', serverConfig.ensureAuthenticated , (req, res) => { sqlQuery.deleteEnquiry(req, res) });
server.post('/api/requestEnquiry', serverConfig.ensureAuthenticated, (req, res) => { sqlQuery.requestEnquiryByID(req, res, req.body.id) });
server.post('/api/requestConfirmedEnquiry', serverConfig.ensureAuthenticated, (req, res) => { sqlQuery.requestConfirmedEnquiryByID(req, res, req.body.id) });
