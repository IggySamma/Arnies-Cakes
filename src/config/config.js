require('dotenv').config({path:__dirname + '/.env'})

/*-------------------Gmail Access setup -------------------------*/

const fs = require('fs').promises;
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
app.use(express.static(path.join(__dirname, '../admin/')));

/*-------------------------- Admin Setup ----------------------- */

/*app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}))*/

const adminPaths = ['/login', '/admin', '/oauth2callback']

adminPaths.forEach( (path) => {
    app.use(path, session({
        secret: `${process.env.COOKIE_SECRET}`,
        name: 'arniescakes',
        resave: false,
        saveUninitialized: true,
        rolling: true,
        cookie: {
            maxAge: 1 * 60 * 60 * 1000, //1 hour
            sameSite: true,
        }
    }))
    app.use(path, passport.initialize());
    app.use(path, passport.session());
})

/*app.use('/login', session({
    secret: `${process.env.COOKIE_SECRET}`,
    name: 'arniescakes',
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        maxAge: 1 * 60 * 60 * 1000, //1 hour
        sameSite: true,
    }
}));
app.use('/login', passport.initialize());
app.use('/login', passport.session());

app.use('/admin', session({
    secret: `${process.env.COOKIE_SECRET}`,
    name: 'arniescakes',
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        maxAge: 1 * 60 * 60 * 1000, //1 hour
        sameSite: true,
    }
}));
app.use('/admin', passport.initialize());
app.use('/admin', passport.session());
app.use('/oauth2callback', session({
    secret: `${process.env.COOKIE_SECRET}`,
    name: 'arniescakes',
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        maxAge: 1 * 60 * 60 * 1000, //1 hour
        sameSite: true,
    }
}));
app.use('/oauth2callback', passport.initialize());
app.use('/oauth2callback', passport.session());*/

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
                /*console.log("Token: " + token)
                console.log("Token Secret: " + tokenSecret)
                console.log("Profile: " + profile)*/
                return done(null, profile);
            } catch (err) {
                return done(err, null);
            }
        }
    )
)
/*
function authenticateUser(user){
    if(user.id == process.env.GMAIL_ID && user.emails[0].value == process.env.GMAIL_USER && user.emails[0].verified == true){
        return true
    } else {
        return false
    }
}
*/
function isAuthenticated (req, res, next) {
    if (req.session.user) next()
    else next('route')
}

/*app.get('/admin', (req, res) => { 
    const OAUTH_SCOPE = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
    ];
    //const state = "some_state";
    const scopes = OAUTH_SCOPE.join(" ");
    const OAUTH_CONSENT_SCEEN_URL = `${process.env.GMAIL_AUTH_URL}?client_id=${process.env.GMAIL_CLIENT_ID}
    &redirect_uri=${process.env.GMAIL_REDIRECTS}
    &response_type=token
    &scope=${scopes}`
   
    res.redirect(OAUTH_CONSENT_SCEEN_URL)
})

app.get('/oauth2callback', async (req, res) => {
    console.log("Req: " + req)
})*/



  



/*-------------------------- Config Expotrs ----------------------- */

module.exports = {
    emailTransporter,
    sqlConfig,
    connection,
    app,
    oauth2Client,
    express,
    passport,
    /*authenticateUser,*/
    isAuthenticated,
}