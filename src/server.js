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
serverConfig.app.get('/tests/email', function(req, res) { res.sendFile(path.join(__dirname, '/tests/sendEmail.html'))});

function isAuthenticated (req, res, next) {
    if (req.session.user) next()
    else next('route')
}

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
*/
/*serverConfig.app.post('/api/upload', parsers.galleryUpload.array("myFiles"), utils.uploadFiles);

serverConfig.app.post('/api/deleteGallery', (req, res) => { utils.deleteFromGallery(req, res) });

//serverConfig.app.post('/api/adminGallery', (req, res) => { sqlQuery.getAllFromGallery(req, res) });
serverConfig.app.post('/api/adminGallery', (req, res) => { utils.filterGallery( req, res)  });
*/

serverConfig.app.get(
    "/login",
    serverConfig.passport.authenticate("google", {
        scope: ["https://www.googleapis.com/auth/plus.login", "email"],
    })
)

serverConfig.app.get(  
    "/oauth2callback",
    serverConfig.passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
    // Successful authentication
    /*console.log(req.session);
    console.log(req.session.passport.user.id);
    console.log(req.session.passport.user.emails);
    console.log(req.session.passport.user.emails[0]);
    console.log(req.session.passport.user.emails[0].value);
    console.log(req.session.passport.user.emails[0].verified);*/

    let id = req.session.passport.user.id
    
    req.session.regenerate((err) => {
        if (err) next(err)

        req.session.user = id
        console.log("Saving ?: " + req.session.user)
        console.log("Saving ?: " + req.sessionID)
        req.session.save((err) => {
            if (err) return next(err)
            res.redirect("/admin")
        })
    })
})

serverConfig.app.get('/admin', isAuthenticated, (req, res) => { 
    console.log(req.session.user)
    console.log(req.sessionID)
    res.sendFile(path.join(__dirname, '/admin/index.html')) 
});
/*
serverConfig.app.get('/admin', (req, res) => { 
    console.log(req.session)
    console.log(req.sessionID)
    res.sendFile(path.join(__dirname, '/admin/index.html')) 
    /*res.redirect("/")*//*
});*/


serverConfig.app.get('/logout', (req, res, next) => {
    req.session.user = null;
    req.session.save((err) => {
        if (err) next(err)
        res.redirect('/')
    });
});