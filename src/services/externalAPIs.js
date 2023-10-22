const serverConfig = require('../config/config.js');
const sqlQuery = require('../services/sql.js');
const { google } = require("googleapis");

function getEmailID(query){  
    return new Promise((resolve, reject) => {    
      const gmail = google.gmail({version: 'v1', auth: serverConfig.oauth2Client});    
      gmail.users.messages.list(      
        {        
          userId: 'me',        
          q: query,      
        },(err, res) => {        
          if (err) {
              reject(err);          
              return;        
          }        
          if (!res.data.messages) {
              resolve([]);          
              return;        
          }
          resolve(res.data.messages);      
    })})
}

function getGmailLinkNStore(ID, date, res){ 
    let messageID = getEmailID('label:sent subject:Arnies Cakes Enquire: Number - ' + ID);
    messageID.then(data => {
        sqlQuery.storeEnquireLink(date, "https://mail.google.com/mail?authuser=arniescakes@gmail.com#all/" + data[0].threadId, ID, res)
    })
}

module.exports = {
    getGmailLinkNStore
}