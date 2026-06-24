/*------------------ Server Setup-----------------*/

const globals = require('./globals/globals.js');
const serverConfig = require('./config/config.js');
const parsers = require('./services/parsers.js');
const sqlQuery = require('./services/sql.js');
const utils = require('./utils/coreUtils.js');
const path = require('path');

serverConfig.initApp().then((app) => {
	app.listen(process.env.SERVER_PORT, () => {
		console.log(`Server started...`);
	});

	/*------------------ Front Page -----------------*/

	app.get('', function (req, res) { res.sendFile(path.join(__dirname, '/public/Index.html')) });
	app.get('/index', function (req, res) { res.sendFile(path.join(__dirname, '/public/Index.html')) });
	app.get('/about', function (req, res) { res.sendFile(path.join(__dirname, '/public/About.html')) });
	app.get('/gallery', function (req, res) { res.redirect('../Gallery.html?type=All') });
	app.get('/flavours', function (req, res) { res.sendFile(path.join(__dirname, '/public/Flavours.html')) });
	app.get('/enquiries', function (req, res) { res.sendFile(path.join(__dirname, '/public/Enquiries.html')) });
	app.get('/enquiriesty', function (req, res) { res.sendFile(path.join(__dirname, '/public/EnquiriesTY.html')) });
	app.get('/tests/email', function (req, res) { res.sendFile(path.join(__dirname, '/tests/sendEmail.html')) });
	app.get('/privacy', function (req, res) { res.sendFile(path.join(__dirname, '/public/Privacy.html')) });

	/*------------------ Front API's -----------------*/

	app.get('/favicon.ico', function (req, res) { res.sendFile(path.join(__dirname, '/public/images/favicon.ico')) })
	app.post('/api/gallery', (req, res) => { utils.filterGallery(req, res) });
	app.get('/api/flavours', (req, res) => { res.json(globals.flavours) });
	app.post('/api/disabledDates', (req, res) => { res.json(globals.disabledDates) })
	app.post('/api/getMainHeaders', (req, res) => { sqlQuery.getEnquiriesMainHeaders(req, res) })
	app.post('/api/getTreatsHeaders', (req, res) => { sqlQuery.getEnquiriesSubHeaders(req, res) })
	app.post('/api/submitEnquirie', parsers.clientUpload.array("clientPhotos"), (req, res) => { parsers.Enquiries(req, res) });

	/*--------------------- Admin Page API's ---------------------*/

	app.post('/api/upload', serverConfig.ensureAuthenticated, parsers.galleryUpload.array("myFiles"), parsers.processImages, (req, res) => { parsers.uploadFiles(req, res) });
	app.post('/api/deleteGallery', serverConfig.ensureAuthenticated, (req, res) => { parsers.deleteFromGallery(req, res) });
	app.post('/api/adminGallery', serverConfig.ensureAuthenticated, (req, res) => { utils.filterGallery(req, res) });
	app.get('/api/refreshGallery', serverConfig.ensureAuthenticated, (req, res) => { parsers.getAllFromGallery() });
	app.post('/api/allEnquiries', serverConfig.ensureAuthenticated, (req, res) => { sqlQuery.getAllEnquiries().then(data => res.json(data)) });
	app.post('/api/allConfirmedEnquiries', serverConfig.ensureAuthenticated, (req, res) => { sqlQuery.getAllConfirmedEnquiries().then(data => res.json(data)) });
	app.post('/api/confirmEnquiry', serverConfig.ensureAuthenticated, (req, res) => { sqlQuery.confirmEnquiry(req, res) });
	app.post('/api/declineEnquiry', serverConfig.ensureAuthenticated, (req, res) => { sqlQuery.declineEnquiry(req, res) });
	app.post('/api/deleteEnquiry', serverConfig.ensureAuthenticated, (req, res) => { sqlQuery.deleteEnquiry(req, res) });
	app.post('/api/requestEnquiry', serverConfig.ensureAuthenticated, (req, res) => { sqlQuery.requestEnquiryByID(req, res, req.body.id) });
	app.post('/api/requestConfirmedEnquiry', serverConfig.ensureAuthenticated, (req, res) => { sqlQuery.requestConfirmedEnquiryByID(req, res, req.body.id) });

	app.post('/api/adminSelect', serverConfig.ensureAuthenticated, (req, res) => { sqlQuery.adminSelect(req, res) });
	app.post('/api/updateFlavours', serverConfig.ensureAuthenticated, parsers.multerParser.none(), (req, res) => { parsers.adminUpdateFlavours(req, res) });

}).catch((err) => {
	console.error('Failed to initialize app:', err);
	process.exit(1);
});
