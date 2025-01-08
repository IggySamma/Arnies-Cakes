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

serverConfig.app.get('', function(req, res) { res.sendFile(path.join(__dirname, '/public/index.html'))});

/*------------------ Gallery API -----------------*/

serverConfig.app.post('/api/gallery', (req, res) => { utils.filterGallery( req, res) });

/*---------------------- Enquires API's -------------------------*/

serverConfig.app.post('/api/disabledDates', (req, res) => { res.json(globals.disabledDates)})

serverConfig.app.post('/api/getMainHeaders', (req, res) => { sqlQuery.getEnquiresMainHeaders(req, res) })

serverConfig.app.post('/api/getTreatsHeaders', (req, res) => { sqlQuery.getEnquiresSubHHeaders(req, res) })

serverConfig.app.post('/api/submitEnquire', parsers.clientUpload.array("clientPhotos"), (req, res) => { 
  console.log(req.body)
  parsers.enquires(req, res)
 });

/*--------------------- Admin Page API's ---------------------*/


serverConfig.app.get('/login', (req, res) => { res.sendFile(path.join(__dirname, '/admin/login.html')) });

serverConfig.app.get('/login/google', serverConfig.passport.authenticate('google', {
    successRedirect: '/admin',
    failureRedirect: '/'
}))

serverConfig.app.get('/admin', (req, res) => { 
    if (serverConfig.checkUserLoggedIn(req)) {
        console.log('User logged');
        res.sendFile(path.join(__dirname, '/admin/index.html'))
      } else {
        console.log('error');
      }
})

serverConfig.app.post('/api/upload', parsers.galleryUpload.array("myFiles"), utils.uploadFiles);

serverConfig.app.post('/api/deleteGallery', (req, res) => { utils.deleteFromGallery(req, res) });

//serverConfig.app.post('/api/adminGallery', (req, res) => { sqlQuery.getAllFromGallery(req, res) });
serverConfig.app.post('/api/adminGallery', (req, res) => { utils.filterGallery( req, res)  });

