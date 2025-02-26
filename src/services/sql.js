const serverConfig = require('../config/config.js');

/*------------------------------- Gallery functions ----------------------------*/

function insertNewToGallery(newType, newPath) {
    let newImage = [
        Type = newType,
        Path = newPath,
    ];

   serverConfig.connection.execute(
        'INSERT INTO Gallery(Type, Path) Values(?, ?);', 
        newImage,
        function (err, results) {
            if (err) {
                console.log(err);
            }
        }
   );
}

function deleteFromGalleryByID(data, res){
    serverConfig.connection.execute(
        'DELETE FROM Gallery WHERE ID= ?;', 
        [data.ID],
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                res.sendStatus(200);
            }
        }
    );
}


/*------------------------------- Enquiries ------------------------------------*/

/*--------------------------- Main Page Retrieve --------------------- */

function getEnquiriesMainHeaders(req, res){
   serverConfig.connection.execute(
        'SELECT * FROM mainHeaders;',
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                var obj = JSON.parse(JSON.stringify(results));
                res.json(obj);
            }
        }
   );
}

function getEnquiriesSubHHeaders(req, res){
    serverConfig.connection.execute(
        'SELECT * FROM subHeaders;',
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                var obj = JSON.parse(JSON.stringify(results));
                res.json(obj);
            }
        }
    );
}

/*--------------------------- Calender functions --------------------- */

function insertDisabledDate(req, res, Date, isRange){
    let updateData = [
        nDate = Date,
        nIsRange = isRange,
    ]

    serverConfig.connection.execute(
        'insert into disabledDates (Date, IsRange) values (?, ?);',
        updateData,
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                var obj = JSON.parse(JSON.stringify(results));
                res.json(obj);
            }
        }
    );
}

function deleteDisabledDate(req, res, ID){
    serverConfig.connection.execute(
        'delete from disabledDates where ID=;',
        [ID],
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                var obj = JSON.parse(JSON.stringify(results));
                res.json(obj);
            }
        }
    );
}

/*--------------------------- Enquirie functions --------------------- */

function storeNewEnquirie(res, cb){
    return new Promise((resolve, reject) => {
        let storeLink = [
            date = "",
            Confirmed = "No",
            Link = "",
            Completed = "No",
        ]

        serverConfig.connection.execute(
            'INSERT INTO Enquiries(Date, Confirmed, Link, Completed) Values(?, ?, ?, ?);',
            storeLink,
            function (err) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    resolve(cb())
                }
            }
        );
    })
}


function storeEnquirieLink(newDate, newLink, nID, res){
    let storeLink = [
        date = newDate,
        Link = newLink,
        ID = nID,
    ]

    serverConfig.connection.execute(
        'UPDATE Enquiries SET date = ?, Link = ? WHERE ID = ?;', 
        storeLink,
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                res.sendStatus(200);
            }
        }
    );
}

function getAllEnquiries(){
    return new Promise((resolve, reject) => {
        serverConfig.connection.execute(
             'SELECT * FROM Enquiries;', 
            function (err, results) {
                if (err) {
                    console.log(err);
                    res.json(new Error(err));
                } else {
                    resolve(JSON.parse(JSON.stringify(results)))
                }
            }
        );
    })
}

function updateEnquiriesConfirmed(req, res, ID, Date, Confirmed){
    let updateData = [
        ndate = Date,
        nConfirmed = Confirmed,
        nID = ID,
    ]

    serverConfig.connection.execute(
        'UPDATE Enquiries SET Date = ?, Confirmed = ? WHERE ID = ?;', 
        [updateData],
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                var obj = JSON.parse(JSON.stringify(results));
                res.json(obj);
            }
        }
    );
}

function removeEnquirie(req, res, ID){
    serverConfig.connection.execute(
        'delete from mainHeaders where ID=;'
        [ID],
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                var obj = JSON.parse(JSON.stringify(results));
                res.json(obj);
            }
        }
    );
}

module.exports = {
    getEnquiriesMainHeaders,
    getEnquiriesSubHHeaders,
    insertNewToGallery,
    deleteFromGalleryByID,
    storeEnquirieLink,
    updateEnquiriesConfirmed,
    removeEnquirie,
    insertDisabledDate,
    deleteDisabledDate,
    getAllEnquiries,
    storeNewEnquirie
}