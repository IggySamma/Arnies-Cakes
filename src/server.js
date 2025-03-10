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

/*------------------ Gallery API -----------------*/

serverConfig.app.post('/api/gallery', (req, res) => { utils.filterGallery( req, res) });

/*------------------ Flavours -----------------*/

serverConfig.app.get('/api/flavours', (req, res) => { res.json(globals.flavours) });

/*---------------------- Enquiries API's -------------------------*/

serverConfig.app.post('/api/disabledDates', (req, res) => { res.json(globals.disabledDates)})

serverConfig.app.post('/api/getMainHeaders', (req, res) => { sqlQuery.getEnquiriesMainHeaders(req, res) })

serverConfig.app.post('/api/getTreatsHeaders', (req, res) => { sqlQuery.getEnquiriesSubHHeaders(req, res) })

serverConfig.app.post('/api/submitEnquirie', parsers.clientUpload.array("clientPhotos"), (req, res) => { parsers.Enquiries(req, res)});

/*--------------------- Admin oAuth2---------------------*/

serverConfig.app.get(
    "/login",
    serverConfig.passport.authenticate("google", {
        scope: ["https://www.googleapis.com/auth/plus.login", "email"],
    })
)

serverConfig.app.get(  
    "/oauth2callback",
    serverConfig.passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res, next) {
        let id = req.session.passport.user.id
        
        req.session.regenerate((err) => {
            if (err) return next(err)
            req.session.user = id
            if(serverConfig.authenticateUser(req)){
                req.session.save((err) => {
                    if (err) return next(err)     
                    return res.redirect('/loginSuccess')
                })
            } else {
                res.redirect('/')
            }

        })
})

serverConfig.app.get('/loginSuccess', (req, res) => {
    res.sendFile(path.join(__dirname, '/admin/saveCookies.html')) 
})

serverConfig.app.get('/loginRedirect', (req, res) => {
    res.redirect('/admin')
})

serverConfig.app.get('/logout', (req, res, next) => {
    req.session.user = null;
    req.session.save((err) => {
        if (err) next(err)
        res.redirect('/')
    });
});

/*--------------------- Admin Page's ---------------------*/

serverConfig.app.get('/admin',(req, res) => { 
    if (serverConfig.isAuthenticated(req)) {
        /*res.sendFile(path.join(__dirname, '/admin/index.html')) */
        res.redirect('../admin/Gallery.html?type=All')
    } else {
        res.redirect("/login")
    }
});

serverConfig.app.get('/admin/index',(req, res) => { 
    if (serverConfig.isAuthenticated(req)) {
        /*res.sendFile(path.join(__dirname, '/admin/index.html')) */
        res.redirect('../admin/Gallery.html?type=All')
    } else {
        res.redirect("/login")
    }
});

serverConfig.app.get('/admin/gallery',(req, res) => { 
    if (serverConfig.isAuthenticated(req)) {
        res.redirect('../admin/Gallery.html?type=All')
    } else {
        res.redirect("/login")
    }
});
serverConfig.app.get('/admin/catalog',(req, res) => { 
    if (serverConfig.isAuthenticated(req)) {
        res.sendFile(path.join(__dirname, '/admin/catalog.html')) 
    } else {
        res.redirect("/login")
    }
});

serverConfig.app.get('/admin/flavours',(req, res) => { 
    if (serverConfig.isAuthenticated(req)) {
        res.sendFile(path.join(__dirname, '/admin/flavours.html')) 
    } else {
        res.redirect("/login")
    }
});

serverConfig.app.get('/admin/order',(req, res) => { 
    if (serverConfig.isAuthenticated(req)) {
        res.sendFile(path.join(__dirname, '/admin/order.html')) 
    } else {
        res.redirect("/login")
    }
});

serverConfig.app.get('/admin/photos',(req, res) => { 
    if (serverConfig.isAuthenticated(req)) {
        res.sendFile(path.join(__dirname, '/admin/photos.html')) 
    } else {
        res.redirect("/login")
    }
});

/*--------------------- Admin Page API's ---------------------*/

serverConfig.app.post('/api/upload', parsers.galleryUpload.array("myFiles"), (req, res) => {
    if (serverConfig.isAuthenticated(req)) {
        parsers.uploadFiles(req, res)
    } else {
        res.redirect("/login")
    }
});

serverConfig.app.post('/api/deleteGallery', (req, res) => { 
    if (serverConfig.isAuthenticated(req)) {
        parsers.deleteFromGallery(req, res) 
    } else {
        res.redirect("/login")
    }
});

serverConfig.app.post('/api/adminGallery', (req, res) => { utils.filterGallery( req, res)  });

