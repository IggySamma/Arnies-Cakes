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

function deleteFromGalleryByID(ID, res){
    serverConfig.connection.execute(
        'DELETE FROM Gallery WHERE ID= ?;', 
        [ID],
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

function checkGalleryByID(ID, path){
    return new Promise((resolve, reject) => {
        let check = [
            ID = ID,
            Path = path,
        ]
    
        serverConfig.connection.execute(
            'SELECT * FROM Gallery WHERE ID= ? AND Path= ? LIMIT 1;',
            check,
            function (err, results){
                if (err){
                    console.log(err)
                    return reject(false);
                } else {
                    if((results[0].ID == ID) && (results[0].Path == path)){
                        return resolve(true);
                    } else {
                        return resolve(false);
                    }
                }
            }
        );
    })
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

function storeNewEnquirie(res, data, cb){
    //console.log(data)
    return new Promise((resolve, reject) => {
        let storeLink = [
            date = "",
            Confirmed = "No",
            Link = "",
            Completed = "No",
            Name = data.Name,
            Order = data.Order,
            Message = data.Message,
            Allergy = data.Allergies,
            Allergy_Message = data["Allergies Information"],
        ]

        serverConfig.connection.execute(
            'INSERT INTO Enquiries(Date, Confirmed, Link, Completed, Name, Order_Details, Message, Allergy, Allergy_Message) Values(?, ?, ?, ?, ?, ?, ?, ?, ?);',
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
             'SELECT * FROM Enquiries ;', 
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

function getAllConfirmedEnquiries(){
    return new Promise((resolve, reject) => {
        serverConfig.connection.execute(
            'SELECT * FROM confirmedEnquiries WHERE Completed = "No" ;', 
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

function confirmEnquiry(req, res){
    let data = req.body;
    let ID = data.id;

    serverConfig.connection.execute(
        'UPDATE Enquiries SET Confirmed = "Yes" WHERE ID = ?', 
        [ID],
        function (err, results) {
            if (err) {
                console.log(err);
                res.json([new Error(err)]);
            } else {
                res.sendStatus(200);
            }
        }
    );
}


function declineEnquiry(req, res){
    let data = req.body;
    let ID = data.id;

    serverConfig.connection.execute(
        'UPDATE Enquiries SET Confirmed = "Rejected" WHERE ID = ?', 
        [ID],
        function (err, results) {
            if (err) {
                console.log(err);
                res.json([new Error(err)]);
            } else {
                res.sendStatus(200);
            }
        }
    );
}

function deleteEnquiry(req, res){
    let data = req.body;
    let ID = data.id;

    serverConfig.connection.execute(
        'DELETE FROM Enquiries WHERE ID = ?', 
        [ID],
        function (err, results) {
            if (err) {
                console.log(err);
                res.json([new Error(err)]);
            } else {
                res.sendStatus(200);
            }
        }
    );
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

function requestEnquiryByID(req, res, ID){
	serverConfig.connection.execute(
		'SELECT * FROM Enquiries WHERE ID = ?;',
		[ID],
		function (err, results) {
			if(err){
				console.log(err);
				res.json(new Error(err));
			} else {
				var obj = JSON.parse(JSON.stringify(results));
				res.json(obj)
			}
		}
	);
}

function requestConfirmedEnquiryByID(req, res, ID) {
	serverConfig.connection.execute(
		'SELECT * FROM confirmedEnquiries WHERE ID = ?;',
		[ID],
		function (err, results) {
			if (err) {
				console.log(err);
				res.json(new Error(err));
			} else {
				var obj = JSON.parse(JSON.stringify(results));
				res.json(obj)
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
	getAllConfirmedEnquiries,
	storeNewEnquirie,
	checkGalleryByID,
	confirmEnquiry,
	declineEnquiry,
	deleteEnquiry,
	requestConfirmedEnquiryByID,
	requestEnquiryByID
}