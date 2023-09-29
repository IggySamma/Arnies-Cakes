const serverConfig = require('../config/config.js');

function uploadFiles(req, res) {
    for (var i = 0; i < req.files.length; i++) {
        insertNewToGallery(req.body.name, "/gallery/" + req.files[i].filename);
    }
    res.sendStatus(200);
}

/*VVVVVVVV move Query*/
function insertNewToGallery(newType, newPath) {
    let newImage = [
        Type = newType,
        Path = newPath,
    ];
    serverConfig.connection.query('INSERT INTO Gallery(Type, Path) Values(?, ?);', newImage,(error, res, fields) => {
        if (error) throw error;
     });
}

function deleteFromGallery(req,res){
    let data = req.body;
    fs.unlink('./gallery/' + data.Path, (err) => {
    if (err) throw err;
    });
        serverConfig.connection.query('DELETE FROM Gallery WHERE ID= ?;', data.ID ,(error, result) => {
            if(result === undefined){
                res.json(new Error("Error rows is undefined"));
            }else{
                /*var obj = JSON.parse(JSON.stringify(result));
                res.json(obj);*/
                res.sendStatus(200);
        }})
};

function sendEmails(enqNum, data, textBody, photos){
    const enquireToSelf = {
        from: "arniescakes@gmail.com",
        to: "arniescakes@gmail.com",
        subject: "Enquire: Number - " + enqNum,
        generateTextFromHTML: true,
        html: '<div style="margin:auto; padding:auto; position: relative; height: 300px; width: 300px;"><img src="cid:logo" style="height: 300px; width: 300px;"></div><div style="margin:auto; padding: 3px 3px 3px 3px; text-align: center; position: relative; top: 220px; height: auto; background-color: #D3BBDD; border-radius: 8px;"><p>Name: ' + data.fullName + '</p><p>Email: ' + data.email + '</p><p>Number: ' + data.number + '</p><p>Date: ' + data.datetime + '</p><p>' + textBody + '</p></div>',    
        attachments: [{
            filename: photos[0].originalname, 
            content: photos[0].buffer, 
        },
        {
            filename: "Logo.png",
            path: "./public/images/home logo.png",
            cid: "logo"
        }
        ],
    };

    serverConfig.emailTransporter.sendMail(enquireToSelf, (error, response) => {
        error ? console.log(error) : serverConfig.emailTransporter.close();
    });

    const enquireToClient = {
        from: "arniescakes@gmail.com",
        to: data.email,
        subject: "Arnies Cakes Enquire: Number - " + enqNum,
        generateTextFromHTML: true,
        html: '<div style="margin:auto; padding:auto; position: relative; height: 300px; width: 300px;"><img src="cid:logo" style="height: 300px; width: 300px;"></div><div style="margin:auto; padding: 3px 3px 3px 3px; text-align: center; position: relative; top: 220px; height: auto; background-color: #D3BBDD; border-radius: 8px;"><p>Name: ' + data.fullName + '</p><p>Email: ' + data.email + '</p><p>Number: ' + data.number + '</p><p>Date: ' + data.datetime + '</p><p>' + textBody + '</p></div>',
        attachments: [{
            filename: photos[0].originalname,
            content: photos[0].buffer,
        },
        {
            filename: "Logo.png",
            path: "./public/images/home logo.png",
            cid: "logo"
        }],
    };

    serverConfig.emailTransporter.sendMail(enquireToClient, (error, response) => {
        error ? console.log(error) : serverConfig.emailTransporter.close();
    });
};


function getEmailID(auth, query){  
    return new Promise((resolve, reject) => {    
      const gmail = google.gmail({version: 'v1', auth});    
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

/*---------------VVV Not finished Just pulls link doesn't store------------ */
function storeEmailLinkToDB(){
    let messageID = getEmailID(oauth2Client, 'label:inbox subject:Enquire: Number - 2');
    messageID.then(data => {
        console.log("https://mail.google.com/mail?authuser=arniescakes@gmail.com#all/" + data[0].id);
    })
}

module.exports = {
    sendEmails,
    getEmailID,
    storeEmailLinkToDB,
    uploadFiles,
    deleteFromGallery
}