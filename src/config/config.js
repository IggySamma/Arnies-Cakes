//require('dotenv').config();
require('dotenv').config({path:__dirname + '/.env'})

/*-------------------Gmail Access setup -------------------------*/

const fs = require('fs').promises;
const path = require('path');
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const {authenticate} = require('@google-cloud/local-auth');
const process = require('process');

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
    database: process.env.SQL_DATABASE
};

const mysql = require('mysql');
//const mysql = require('mysql2/promise');
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

var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');
//var db = require('../db');
var router = express.Router();
//var logger = require('morgan');
var session = require('express-session');
/*
var authr = router.get('/admin', function(req, res, next) {
    res.render(path.join(__dirname, '../admin/index.html'));
});

app.use('/', authr)
*/
app.use(session({
    secret: process.env.GMAIL_SECRET,
    resave: false,
    saveUninitialized: false,
    /*cookie: {
        secure: true
    }*/
    //store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}));

passport.use(new GoogleStrategy({
    clientID: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    callbackURL: '/login/google',
    scope: [ 'profile' ]
    }, function verify(issuer, profile, cb) {
    if(profile.id !== process.env.GMAIL_ID){
        cb('Incorrect credentials. IP Logged :)');
    } else {
        console.log(profile.id);
        cb(null, profile)
    }}
));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, username: user.username, name: user.name });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

function checkUserLoggedIn(req, res, next) {
    console.log(req.session)
    return req.session;
}
/*-------------------------- Config Expotrs ----------------------- */

module.exports = {
    emailTransporter,
    sqlConfig,
    connection,
    app,
    oauth2Client,
    passport,
    checkUserLoggedIn,
    express
}