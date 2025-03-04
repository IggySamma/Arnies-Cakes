require('dotenv').config({path:__dirname + '/.env'})

/*-------------------Gmail Access setup -------------------------*/


const path = require('path');
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const {authenticate} = require('@google-cloud/local-auth');
const process = require('process');


const passport = require('passport');
const session = require('express-session');
//const session = require('cookie-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID, // ClientID
    process.env.GMAIL_CLIENT_SECRET, // Client Secret
    "https://developers.google.com/oauthplayground/" // Redirect URL
);


oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

const accessToken = oauth2Client.getAccessToken()

let emailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER, 
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken
    },
    tls: {
        rejectUnauthorized: false
    },
});

/*----------------------------- MySQL Config ---------------------*/
let sqlConfig = {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    port: process.env.SQL_PORT
};

const mysql = require('mysql2');
const connection =  mysql.createConnection(sqlConfig);


/*-------------------------- Server Setup ----------------------- */

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public/')));
app.use(express.static('/gallery/'));
app.use('/admin/', express.static('admin'));


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
        },
        genid: function(req) {
            return genuuid()
        },
        store: memoryStore,
    })
)


const adminPaths = ['/login', '/admin', '/oauth2callback']

adminPaths.forEach( (path) => {
    app.use(path, passport.initialize());
    app.use(path, passport.session());
})

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

function authenticateUser(req) {
    if (req.session.user === process.env.GMAIL_ID){
        return true
    } else {
        return false
    }
}

function isAuthenticated (req) {
    if(Object.keys(memoryStore.sessions).includes(req.sessionID)){
        const sessionData = JSON.parse(memoryStore.sessions[req.sessionID])
        if (sessionData.user === process.env.GMAIL_ID){ 
            return true
        }
    } else {
        return false
    }
}

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: `${process.env.GMAIL_CLIENT_ID}`,
            clientSecret: `${process.env.GMAIL_CLIENT_SECRET}`,
            callbackURL: `${process.env.GMAIL_REDIRECTS}`,
        },
        async function(token, tokenSecret, profile, done) {
            try {
                return done(null, profile);
            } catch (err) {
                return done(err, null);
            }
        }
    )
)

/*-------------------------- Config Expotrs ----------------------- */

module.exports = {
    emailTransporter,
    sqlConfig,
    connection,
    app,
    oauth2Client,
    express,
    passport,
    authenticateUser,
    isAuthenticated,
    memoryStore,
}