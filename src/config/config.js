const isProd = false;
const isDocker = false;
const rebuildAllPages = false;

require('dotenv').config(isProd ? { path: __dirname + '/.env.prod' } : { path: __dirname + '/.env.dev' })

/*-------------------Gmail Access setup -------------------------*/

const fs = require('fs');
const path = require('path');
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const process = require('process');

const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const oauth2Client = new OAuth2(
	process.env.GMAIL_CLIENT_ID,
	process.env.GMAIL_CLIENT_SECRET,
	process.env.GMAIL_REDIRECTS
);

const oauth2Scopes = [
	'https://mail.google.com',
	'https://www.googleapis.com/auth/userinfo.email',
	'https://www.googleapis.com/auth/userinfo.profile',
	'openid'
];

let emailTransporter = null;

/*----------------------------- MySQL Config ---------------------*/

let sqlConfig = {
	host: isDocker ? process.env.SQL_HOST : process.env.SQL_HOST_LOCAL,
	user: process.env.SQL_USER,
	password: process.env.SQL_PASSWORD,
	database: process.env.SQL_DATABASE,
	port: process.env.SQL_PORT,
};

const mysql = require('mysql2');
const connection = mysql.createPool(sqlConfig);

connection.addListener('error', (err) => {
	console.log(err);
})


function updateEnvVariable(key, value) {
	const envPath = path.resolve(
		path.join(__dirname, isProd ? '.env.prod' : '.env.dev')
	);
	let envContent = '';

	try {
		envContent = fs.readFileSync(envPath, 'utf-8');
	} catch (err) {
		if (err.code === 'ENOENT') {
			console.log('.env file not found, creating one...');
		} else {
			throw err;
		}
	}

	const envLines = envContent.split('\n');

	let keyFound = false;
	const updatedLines = envLines.map((line) => {
		if (line.startsWith(`${key}=`)) {
			keyFound = true;
			return `${key}=${value}`;
		}
		return line;
	});

	if (!keyFound) {
		updatedLines.push(`${key}=${value}`);
	}

	const finalContent = updatedLines.join('\n');
	fs.writeFileSync(envPath, finalContent, 'utf-8');
	process.env[key] = value; // keep in-memory env in sync for the current process
	console.log(`${key} updated in .env`);
}

async function saveRefreshTokenToDb(token) {
	try {
		await connection.promise().query(
			'INSERT INTO app_config (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
			['gmail_refresh_token', token, token]
		);
		console.log('Refresh token backed up to MySQL.');
	} catch (err) {
		console.error('Failed to back up refresh token to MySQL (non-fatal, .env still has it):', err);
	}
}

async function loadRefreshTokenFromDb() {
	try {
		const [rows] = await connection.promise().query(
			'SELECT value FROM app_config WHERE key_name = ?',
			['gmail_refresh_token']
		);
		return rows[0]?.value || null;
	} catch (err) {
		console.error('Failed to load refresh token from MySQL:', err);
		return null;
	}
}

async function saveRefreshToken(token) {
	updateEnvVariable('GMAIL_REFRESH_TOKEN', token); // primary, synchronous, must succeed
	await saveRefreshTokenToDb(token); // backup, best-effort
}

async function loadRefreshToken() {
	const envToken = process.env.GMAIL_REFRESH_TOKEN;
	if (envToken) return envToken;

	console.log('No refresh token in .env, checking MySQL backup...');
	const dbToken = await loadRefreshTokenFromDb();
	if (dbToken) {
		// Heal .env so it's consistent again going forward.
		updateEnvVariable('GMAIL_REFRESH_TOKEN', dbToken);
	}
	return dbToken;
}

async function getAccessTokenOrHandleError() {
	try {
		const accessTokenResponse = await oauth2Client.getAccessToken();
		console.log('Access Token generated');
		return accessTokenResponse?.token;
	} catch (err) {
		if (err.response?.data?.error === 'invalid_grant') {
			console.log('Invalid grant: Refresh token might be expired or revoked. Re-auth via /login required.');
		} else {
			console.error('Unexpected error while fetching access token:', err);
		}
		return null;
	}
}

async function refreshEmailTransporter() {
	try {
		const accessToken = await getAccessTokenOrHandleError();
		if (!accessToken) {
			console.error('Could not refresh email transporter: no access token available.');
			return;
		}

		emailTransporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: process.env.GMAIL_USER,
				clientId: process.env.GMAIL_CLIENT_ID,
				clientSecret: process.env.GMAIL_CLIENT_SECRET,
				refreshToken: oauth2Client.credentials.refresh_token,
				accessToken: accessToken,
			},
			tls: {
				rejectUnauthorized: false,
			},
		});

		console.log("Email transporter refreshed with new access token.");
	} catch (error) {
		console.error("Failed to refresh email transporter:", error);
	}
}

async function initGmailAuth() {
	const storedToken = await loadRefreshToken();
	if (storedToken) {
		oauth2Client.setCredentials({ refresh_token: storedToken });
		await refreshEmailTransporter();
	} else {
		console.log('No refresh token available yet. Visit /login to authenticate.');
	}
}

function getEmailTransporter() {
	return emailTransporter;
}

function getOauth2Client() {
	return oauth2Client
}

/*-------------------------- Server Setup ----------------------- */

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public/')));
app.use(express.static('/gallery/'));

// Required in production behind a reverse proxy (nginx, load balancer, etc.)
// so secure cookies and req.protocol behave correctly.
if (isProd) {
	app.set('trust proxy', 1);
}

/*-------------------------- Admin Setup ----------------------- */

const MySQLStore = require('express-mysql-session')(session);

function genuuid() { // Public Domain/MIT
	var d = new Date().getTime();//Timestamp
	var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16;//random number between 0 and 16
		if (d > 0) {//Use timestamp until depleted
			r = (d + r) % 16 | 0;
			d = Math.floor(d / 16);
		} else {//Use microseconds since page-load if supported
			r = (d2 + r) % 16 | 0;
			d2 = Math.floor(d2 / 16);
		}
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
}

passport.serializeUser((user, done) => {
	done(null, user.id);
});

/*passport.deserializeUser((id, done) => {
	done(null, { id });
});*/
passport.deserializeUser((id, done) => {
	if (!id) {
		return done(null, false);
	}

	done(null, { id });
});

passport.use(
	new GoogleStrategy({
		clientID: process.env.GMAIL_CLIENT_ID,
		clientSecret: process.env.GMAIL_CLIENT_SECRET,
		callbackURL: process.env.GMAIL_REDIRECTS,
		passReqToCallback: true,
		scope: oauth2Scopes
	},
		async function (req, accessToken, refreshToken, profile, cb) {
			/*if (profile.id === process.env.GMAIL_ID) {
				if (refreshToken) { 
					oauth2Client.setCredentials({ refresh_token: refreshToken });
					await saveRefreshToken(refreshToken);
					await refreshEmailTransporter();
				}
				return cb(null, profile);
			} else {
				return cb(null, false);
			}*/
			if (profile.id !== process.env.GMAIL_ID) {
				return cb(
					new Error(
						`Unauthorized Google account: ${profile.id}`
					)
				);
			}

			if (refreshToken) {
				oauth2Client.setCredentials({
					refresh_token: refreshToken
				});

				await saveRefreshToken(refreshToken);
				await refreshEmailTransporter();
			}

			return cb(null, profile);
		}
	));

GoogleStrategy.prototype.authorizationParams = function (options) {
	return {
		access_type: 'offline',
		prompt: 'consent', // forces Google to reissue refresh_token every time, needed while app is in testing mode
	};
};
/*
function isAuthenticated(req) {
	return req.isAuthenticated() && req.user.id === process.env.GMAIL_ID;
}
*/
function isAuthenticated(req) {
	return typeof req.isAuthenticated === 'function'
		&& req.isAuthenticated()
		&& req.user?.id === process.env.GMAIL_ID;
}

function ensureAuthenticated(req, res, next) {
	if (isAuthenticated(req)) {
		return next();
	}

	//Debug only
	/*
	console.log('Auth failed:', {
		authenticated: req.isAuthenticated?.(),
		user: req.user,
		expected: process.env.GMAIL_ID,
		url: req.originalUrl
	});
	*/
	req.session.returnTo = req.originalUrl;
	res.redirect('/login');
}


/*-------------------------- App init ----------------------- */
let sessionStore;
let appReady = false;

async function initApp() {
	if (appReady) return app;

	await initGmailAuth();

	sessionStore = new MySQLStore({
		schema: {
			tableName: 'sessions',
			columnNames: {
				session_id: 'session_id',
				expires: 'expires',
				data: 'data',
			},
		},
	}, connection);

	sessionStore.on('error', (err) => {
		console.error('Session store error:', err);
	});

	app.use(
		session({
			secret: process.env.COOKIE_SECRET,
			name: 'arniescakes',
			resave: false,
			saveUninitialized: false,
			store: sessionStore,
			cookie: {
				httpOnly: true,
				secure: isProd,
				/*maxAge: 1000 * 60 * 60, // 1 hour*/
				maxAge: 60 * 60 * 500, //30 mins
				//maxAge: 60 * 1000, //1 min
				sameSite: 'lax',
			},
			genid: function (req) {
				return genuuid()
			},
		})
	);

	app.use(passport.initialize());
	app.use(passport.session());

	//Debugging only
	/*app.use((req, res, next) => {
		console.log({
			path: req.path,
			hasSession: !!req.session,
			sessionID: req.sessionID,
			authenticated: req.isAuthenticated?.()
		});

		next();
	});*/

	registerRoutes();

	appReady = true;
	console.log('App fully initialized: Gmail auth loaded, session middleware and routes registered.');
	return app;
}

/*-------------------------- Route registration ----------------------- */

function registerRoutes() {

	app.get('/login', passport.authenticate('google', { scope: oauth2Scopes }));

	app.get('/oauth2callback',
		passport.authenticate('google', { failureRedirect: '/login' }),
		(req, res) => {
			const returnTo = req.session.returnTo || '/admin';
			delete req.session.returnTo;
			res.redirect(returnTo);
		}
	);

	app.get('/admin/logout', (req, res) => {
		req.logout(() => {
			req.session.destroy(() => {
				res.redirect('/');
			});
		});
	});

	app.get('/admin', ensureAuthenticated, (req, res) => {
		res.sendFile(path.join(__dirname, '../admin/index.html'))
	});

	app.get('/admin/', ensureAuthenticated, (req, res) => {
		res.sendFile(path.join(__dirname, '../admin/index.html'))
	});

	/*-------------------------- Admin Auto Paths ----------------------- */

	const adminPath = path.join(__dirname, '../admin/')

	function getAllFilesAndDirs(dir) {
		let results = [];

		const list = fs.readdirSync(dir);
		list.forEach(file => {
			const fullPath = path.join(dir, file);
			const stat = fs.statSync(fullPath);

			if (stat && stat.isDirectory()) {
				results = results.concat(getAllFilesAndDirs(fullPath));
			} else {
				const temp = fullPath.replace(path.join(__dirname, '../admin/'), '')
					.replace(/ /g, '%20')
					.replace(/\\/g, '/');

				results.push(temp);
			}
		});

		return results;
	}

	function removePathSuffix(str) {
		const index = str.lastIndexOf('.');
		return index !== -1 ? str.slice(0, index) : str;
	}

	getAllFilesAndDirs(adminPath).forEach(file => {
		app.get(`/admin/${file}`, ensureAuthenticated, (req, res) => {
			res.sendFile(path.join(__dirname, '../admin/' + file.replace(/%20/g, ' ')))
		})

		app.get(`/admin/${removePathSuffix(file)}`, ensureAuthenticated, (req, res) => {
			res.sendFile(path.join(__dirname, '../admin/' + file.replace(/%20/g, ' ')))
		})
	})

	app.get('/auth-failed', (req, res) => {
		res.status(403).send('Unauthorized Google account');
	});
}


/*-------------------------- Config Exports ----------------------- */

module.exports = {
	initApp,
	//emailTransporter,
	getEmailTransporter,
	sqlConfig,
	connection,
	getApp: () => app,
	//oauth2Client,
	getOauth2Client,
	express,
	passport,
	ensureAuthenticated,
	isDocker,
	rebuildAllPages,
}