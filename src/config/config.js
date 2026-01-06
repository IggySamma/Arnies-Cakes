const isProd = false;
const isDocker = true;
const rebuildAllPages = false;

require('dotenv').config(isProd ? { path: __dirname + '/.env.prod' } : { path: __dirname + '/.env.dev' })

/*-------------------Gmail Access setup -------------------------*/

const path = require('path');
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const {authenticate} = require('@google-cloud/local-auth');
const process = require('process');


const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    /*"https://developers.google.com/oauthplayground/"*/
    process.env.GMAIL_REDIRECTS
);

const oauth2Scopes = [
        'https://mail.google.com',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'openid'
];

oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});


//const accessToken = oauth2Client.getAccessToken()
let accessToken = getAccessTokenOrHandleError()

/*let emailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER, 
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        //accessToken: accessToken
    },
    tls: {
        rejectUnauthorized: false
    },
});*/

let emailTransporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		type: "OAuth2",
		user: process.env.GMAIL_USER,
		clientId: process.env.GMAIL_CLIENT_ID,
		clientSecret: process.env.GMAIL_CLIENT_SECRET,
		refreshToken: process.env.GMAIL_REFRESH_TOKEN,
		accessToken: accessToken,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

async function refreshEmailTransporter() {
    try {
        const accessTokenResponse = await oauth2Client.getAccessToken();
        const accessToken = accessTokenResponse.token;` // important!`

        emailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
            type: "OAuth2",
            user: process.env.GMAIL_USER,
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN,
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

//refreshEmailTransporter();

async function getAccessTokenOrHandleError() {
    try {
        const accessToken = await oauth2Client.getAccessToken();
        console.log('Access Token generated')
        return accessToken;
    } catch (err) {
        if (err.response?.data?.error === 'invalid_grant') {
            console.log('Invalid grant: Refresh token might be expired or revoked.');
            //handleInvalidGrant(); 
        } else {
            console.error('Unexpected error while fetching access token:', err);
        }
    }
}

/*function handleInvalidGrant(){
        console.log('handler')
}*/



/*----------------------------- MySQL Config ---------------------*/

let sqlConfig = {
	host: isDocker ? process.env.SQL_HOST : process.env.SQL_HOST_LOCAL,
	user: process.env.SQL_USER,
	password: process.env.SQL_PASSWORD,
	database: process.env.SQL_DATABASE,
	port: process.env.SQL_PORT,
};

const mysql = require('mysql2');
//const connection =  mysql.createConnection(sqlConfig);
const connection = mysql.createPool(sqlConfig);

connection.addListener('error', (err) => {
	console.log(err);
})



/*-------------------------- Server Setup ----------------------- */

const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public/')));
app.use(express.static('/gallery/'));

/*-------------------------- Admin Setup ----------------------- */

const memoryStore = new session.MemoryStore();

app.use(
    session({
        secret: `${process.env.COOKIE_SECRET}`,
        name: 'arniescakes',
        resave: true,
        saveUninitialized: false,
        /*rolling: true,*/
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1 * 60 * 60 * 500, //30 mins
            sameSite: true,
            //sameSite: 'lax',
        },
        genid: function(req) {
            return genuuid()
        },
        store: memoryStore,
    })
)

app.use(passport.initialize());
app.use(passport.session());

function genuuid() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    done(null, { id });
});

/*
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            callbackURL: process.env.GMAIL_REDIRECTS,
        },
        (token, tokenSecret, profile, done) => {
            if (profile.id === process.env.GMAIL_ID) {
                return done(null, profile);
            } else {
                return done(null, false); 
            }
        }
    )
);*/


passport.use(
    new GoogleStrategy({
        clientID: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        callbackURL: process.env.GMAIL_REDIRECTS,
        passReqToCallback: true,
        scope: oauth2Scopes
  },
  function (req, accessToken, refreshToken, profile, cb) {
        if (profile.id === process.env.GMAIL_ID) {
		updateEnvVariable('GMAIL_REFRESH_TOKEN', refreshToken);
		getAccessTokenOrHandleError()
            	return cb(null, profile);
        } else {
            	return cb(null, false); 
        }
  }
));

GoogleStrategy.prototype.authorizationParams = function (options) {
        return {
                access_type: 'offline',
                prompt: 'consent',
        };
  };

function isAuthenticated(req) {
    return req.isAuthenticated() && req.user.id === process.env.GMAIL_ID;
}

function ensureAuthenticated(req, res, next) {
    if (isAuthenticated(req)) {
        return next();
    }
    res.redirect('/login');
}


/*-------------------------- Admin Paths ----------------------- */

app.get('/login', passport.authenticate('google', { /*scope: ['email', 'profile']*/  scope: oauth2Scopes }));

app.get('/oauth2callback',

    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        req.session.user = req.user.emails[0].value;
        res.redirect('/loginSuccess');
    }
);

app.get('/loginSuccess', (req, res) => {
    refreshEmailTransporter();
    res.sendFile(path.join(__dirname, '../admin/saveCookies.html')) 
})

app.get('/loginRedirect', (req, res) => {
    res.redirect('/admin')
})

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
    console.log(`${key} updated in .env`);
  }

/*-------------------------- Admin Auto Paths ----------------------- */

const adminPath = path.join(__dirname, '../admin/')

function getAllFilesAndDirs(dir) {
    let results = [];

    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat && stat.isDirectory()) {
            /*temp = fullPath.replace(path.join(__dirname, '../admin/'),'')
            results.push(temp.replace(/\\/g, '/'));*/
            results = results.concat(getAllFilesAndDirs(fullPath));
        } else {
            temp =  fullPath.replace(path.join(__dirname, '../admin/'), '')
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


/*-------------------------- Config Expotrs ----------------------- */

module.exports = {
	emailTransporter,
	sqlConfig,
	connection,
	app,
	oauth2Client,
	express,
	passport,
	ensureAuthenticated,
	memoryStore,
	isDocker,
	rebuildAllPages,
}