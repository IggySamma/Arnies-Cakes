/*------------------ server Setup-----------------*/

const globals = require('./globals/globals.js');
const serverConfig = require('./config/config.js');
const parsers = require('./services/parsers.js');
const sqlQuery = require('./services/sql.js');
const utils = require('./utils/coreUtils.js');
const path = require('path');

serverConfig.app.listen(3000, () => {
    console.log(`Server started...`);
});

serverConfig.app.get('', function(req, res) { res.sendFile(path.join(__dirname, '/public/Index.html'))});
serverConfig.app.get('/index', function(req, res) { res.sendFile(path.join(__dirname, '/public/Index.html'))});
serverConfig.app.get('/about', function(req, res) { res.sendFile(path.join(__dirname, '/public/About.html'))});
serverConfig.app.get('/gallery', function(req, res) { res.redirect('../Gallery.html?type=All')});
serverConfig.app.get('/flavours', function(req, res) { res.sendFile(path.join(__dirname, '/public/Flavours.html'))});
serverConfig.app.get('/enquiries', function(req, res) { res.sendFile(path.join(__dirname, '/public/Enquiries.html'))});
serverConfig.app.get('/enquiriesty', function(req, res) { res.sendFile(path.join(__dirname, '/public/EnquiriesTY.html'))});

/*------------------ Gallery API -----------------*/

serverConfig.app.post('/api/gallery', (req, res) => { utils.filterGallery( req, res) });

/*------------------ Flavours -----------------*/

serverConfig.app.get('/api/flavours', (req, res) => { res.json(globals.flavours) });

/*---------------------- Enquiries API's -------------------------*/

serverConfig.app.post('/api/disabledDates', (req, res) => { res.json(globals.disabledDates)})

serverConfig.app.post('/api/getMainHeaders', (req, res) => { sqlQuery.getEnquiriesMainHeaders(req, res) })

serverConfig.app.post('/api/getTreatsHeaders', (req, res) => { sqlQuery.getEnquiriesSubHHeaders(req, res) })

serverConfig.app.post('/api/submitEnquirie', parsers.clientUpload.array("clientPhotos"), (req, res) => { parsers.Enquiries(req, res)});

/*--------------------- Admin Page API's ---------------------*/

/*
serverConfig.app.get('/login', (req, res) => { res.sendFile(path.join(__dirname, '/admin/login.html')) });

serverConfig.app.get('/login/google', serverConfig.passport.authenticate('google', {
    successRedirect: '/admin',
    failureRedirect: '/'
}))

serverConfig.app.get('/admin', (req, res) => { 
  res.sendFile(path.join(__dirname, '/admin/index.html'))
    /*if (serverConfig.checkUserLoggedIn(req)) {
        console.log('User logged');
        res.sendFile(path.join(__dirname, '/admin/index.html'))
      } else {
        console.log('error');
      }*/
/*})*/

/*serverConfig.app.post('/api/upload', parsers.galleryUpload.array("myFiles"), utils.uploadFiles);

serverConfig.app.post('/api/deleteGallery', (req, res) => { utils.deleteFromGallery(req, res) });

//serverConfig.app.post('/api/adminGallery', (req, res) => { sqlQuery.getAllFromGallery(req, res) });
serverConfig.app.post('/api/adminGallery', (req, res) => { utils.filterGallery( req, res)  });
*/
