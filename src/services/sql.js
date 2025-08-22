const serverConfig = require('../config/config.js');

/*------------------------------- Gallery functions ----------------------------*/

function insertNewToGallery(newType, newPath) {
	let newImage = [
		Type = newType,
		Path = newPath,
	];

	serverConfig.connection.execute(
		'INSERT INTO gallery(Type, Path) Values(?, ?);', 
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
		'DELETE FROM gallery WHERE ID= ?;', 
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
            'SELECT * FROM gallery WHERE ID= ? AND Path= ? LIMIT 1;',
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
        'SELECT * FROM mainheaders;',
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                var obj = JSON.parse(JSON.stringify(results));
		//console.log(obj)
                res.json(obj);
            }
        }
   );
}

function getEnquiriesSubHeaders(req, res){
    serverConfig.connection.execute(
        'SELECT * FROM subheaders;',
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                var obj = JSON.parse(JSON.stringify(results));
		//console.log(obj)
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
        'insert into disableddates (Date, IsRange) values (?, ?);',
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
        'delete from disableddates where ID=;',
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

	let colDel, colDelDate, allergy_Message;

	if('Collection' in data){
		colDel = 'Collection';
		colDelDate = data['Date of collection'];
	} else {
		colDel = 'Delivery';
		colDelDate = data['Date of delivery']
	}

	data.Allergies === 'No' ? allergy_Message = '' : allergy_Message = data["Allergies Information"];

	return new Promise((resolve, reject) => {
		let storeLink = [
			date = data['Date of Event'],
			Confirmed = "No",
			Link = "",
			Completed = "No",
			Name = data.Name,
			Order = JSON.parse(JSON.stringify(data.Order)),
			Message = data.Message,
			Allergy = data.Allergies,
			Allergy_Message = allergy_Message,
			Email = data.Email,
			ColDel = colDel,
			ColDelDate = colDelDate,
		]

		//console.log(storeLink);

		serverConfig.connection.execute(
		'INSERT INTO enquiries(Date, Confirmed, Link, Completed, Name, Order_Details, Message, Allergy, Allergy_Message, Email, ColDel, ColDelDate) Values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
		storeLink,
		function (err) {
			if (err) {
			console.log(err);
			console.log(storeLink);
			res.sendStatus(500);
			} else {
			resolve(cb())
			}
		});
	})
}


function storeEnquirieLink(newDate, newLink, nID, res){
    let storeLink = [
        date = newDate,
        Link = newLink,
        ID = nID,
    ]

    serverConfig.connection.execute(
        'UPDATE enquiries SET date = ?, Link = ? WHERE ID = ?;', 
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
             'SELECT * FROM enquiries ;', 
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
            'SELECT * FROM confirmedenquiries WHERE Completed = "No" ;', 
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
        'UPDATE enquiries SET Confirmed = "Yes" WHERE ID = ?', 
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
        'UPDATE enquiries SET Confirmed = "Rejected" WHERE ID = ?', 
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
        'DELETE FROM enquiries WHERE ID = ?', 
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
        'UPDATE enquiries SET Date = ?, Confirmed = ? WHERE ID = ?;', 
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
		'SELECT * FROM enquiries WHERE ID = ?;',
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
		'SELECT * FROM confirmedenquiries WHERE ID = ?;',
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
        'delete from mainheaders where ID=;'
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
	getEnquiriesSubHeaders,
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