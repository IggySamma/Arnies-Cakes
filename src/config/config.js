//require('dotenv').config();
require('dotenv').config({path:__dirname+'/.env'})

/*-------------------Gmail Access setup -------------------------*/
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

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

/*-------------------------- Server Setup ----------------------- */

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(express.static('/gallery/'));

module.exports = {
    emailTransporter,
    sqlConfig,
    app
}
