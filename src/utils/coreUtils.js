const globals = require('../globals/globals.js');
const serverConfig = require('../config/config.js');
const sqlQuery = require('../services/sql.js');
const eApi = require('../services/externalAPIs.js');

/*------------------------------- Gallery ------------------------------------*/

function filterGallery(req, res){
    if(req.body.params === 'All'){
        res.json(globals.gallery);
    } else {
        tempGallery = [];
        for(let i = 0; i < globals.gallery.length; i++){
            if(globals.gallery[i].Type === req.body.params){
                tempGallery.push(globals.gallery[i]);
            }
        }
        if(tempGallery.length === 0){
            return res.json(globals.gallery);
        }
        res.json(tempGallery)
    }
}

function uploadFiles(req, res) {
    for (var i = 0; i < req.files.length; i++) {
        sqlQuery.insertNewToGallery(req.body.name, "/gallery/" + req.files[i].filename);
    }
    res.sendStatus(200);
}

function deleteFromGallery(req,res){
    let data = req.body;
    fs.unlink('./gallery/' + data.Path, (err) => {
    if (err) throw err;
    });
    sqlQuery.deleteFromGalleryByID(data, res)
};

/*------------------------------- Enquiries ------------------------------------*/

function sendEmails(enqNum, data, textBody, photos, res, date){
    let photo = [];
    photos.forEach( item => { 
        attach = {"filename": item.originalname, "content": item.buffer}
        photo.push(attach);
    })
    
    const EnquirieToClient = {
        from: "arniescakes@gmail.com",
        to: data.Email,
        subject: "Arnies Cakes Enquirie: Number - " + enqNum,
        generateTextFromHTML: true,
        //html: '<div style="margin:auto; padding:auto; position: relative; height: 300px; width: 300px;"><img src="cid:logo" style="height: 300px; width: 300px;"></div><div style="margin:auto; padding: 3px 3px 3px 3px; text-align: center; position: relative; top: 220px; height: auto; background-color: #D3BBDD; border-radius: 8px;"><p>' + textBody + '</p></div>',
        html: '<style>table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%;}td, th {border: 1px solid #dddddd;text-align: left;padding: 8px;}tr:nth-child(even) {background-color: #ECE3F0;}</style><div style="margin:auto; padding:auto; position: relative; height: 300px; width: 300px;"><img src="cid:logo" style="height: 300px; width: 300px;"></div><div style="margin:auto; padding: 3px 3px 3px 3px; text-align: center; position: relative; top: 220px; height: auto; background-color: #D3BBDD; border-radius: 8px;"><p>' + textBody + '</p></div>',
        attachments: [
       ...photo,
        {
            filename: "Logo.png",
            path: "./public/images/home logo.png",
            cid: "logo"
        }],
    };
    //console.log(EnquirieToClient.html);

    serverConfig.emailTransporter.sendMail(EnquirieToClient, (error, response) => {
        error ? console.log(error) : serverConfig.emailTransporter.close();
        eApi.getGmailLinkNStore(enqNum, date, res)
    });

    const EnquirieToSelf = {
        from: "arniescakes@gmail.com",
        to: "arniescakes@gmail.com",
        subject: "NEW Enquirie: Number - " + enqNum,
        generateTextFromHTML: true,
        html: '<div style="margin:auto; padding:auto; position: relative; height: 300px; width: 300px;"><img src="cid:logo" style="height: 300px; width: 300px;"></div><div style="margin:auto; padding: 3px 3px 3px 3px; text-align: center; position: relative; top: 220px; height: auto; background-color: #D3BBDD; border-radius: 8px;"><p>' + textBody + '</p></div>',
        attachments: [
       ...photo,
        {
            filename: "Logo.png",
            path: "./public/images/home logo.png",
            cid: "logo"
        }],
    };

    serverConfig.emailTransporter.sendMail(EnquirieToSelf, (error, response) => {
        error ? console.log(error) : serverConfig.emailTransporter.close();
    });
};

module.exports = {
    sendEmails,
    uploadFiles,
    deleteFromGallery,
    filterGallery
}