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

const safe = (val) => (val === undefined || val === null ? "" : String(val));

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
			date = safe(data['Date of Event']),
			Confirmed = "No",
			Link = "",
			Completed = "No",
			Name = safe(data.Name),
			Order = safe(JSON.parse(JSON.stringify(data.Order))),
			Message = safe(data.Message),
			Allergy = safe(data.Allergies),
			Allergy_Message = safe(allergy_Message),
			Email = safe(data.Email),
			ColDel = safe(colDel),
			ColDelDate = safe(colDelDate),
			Address = safe(data.Address),
			number = safe(data.Number),
			Price = 0,
			PricePaid = 0
		]

		//console.log(storeLink);

		serverConfig.connection.execute(
		'INSERT INTO enquiries(Date, Confirmed, Link, Completed, Name, Order_Details, Message, Allergy, Allergy_Message, Email, ColDel, ColDelDate, Address, Number, Price, PricePaid) Values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?);',
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
             'SELECT * FROM enquiries WHERE Confirmed <> ?;', 
	     ['Declined'],
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

async function adminSelect(req, res) {
	try {
		const data = await adminSelectQuery();
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.message });
	}
}

function adminSelectQuery() {
	return new Promise((resolve, reject) => {
		serverConfig.connection.execute(
			`SELECT
				f.ID, 
				f.Heading, 
				f.Type, 
				f.Text, 
				f.Flavours,
				mh.step AS step,
				mh.minOrder AS minOrder,
				GROUP_CONCAT(mh.ID ORDER BY mh.ID SEPARATOR ',') AS hID
			FROM flavours f
			
			LEFT JOIN mainheaders mh
				ON mh.flavoursRecId = f.ID
				AND f.Heading = 'Main'
			WHERE f.Heading = 'Main'   
			GROUP BY
				f.ID, f.Heading, f.Type, f.Text, f.Flavours, mh.step, mh.minOrder
			
			UNION ALL  
			
			SELECT
				f.ID,
				f.Heading,
				f.Type,
				f.Text,
				f.Flavours,
				sh.step AS step,
				sh.minOrder AS minOrder,
				sh.ID AS hID
			FROM flavours f  
			
			LEFT JOIN subheaders sh
				ON sh.flavoursRecId = f.ID
				AND f.Heading = 'Sub'
			WHERE f.Heading = 'Sub';`,

			(err, results) => {
				if (err) return reject(err);
				resolve(JSON.parse(JSON.stringify(results)));
			}
		);
	});
}

/*
function adminSelect(req, res) {
	serverConfig.connection.execute(
		`SELECT
			f.ID, 
			f.Heading, 
			f.Type, 
			f.Text, 
			f.Flavours,
			mh.step AS step,
			mh.minOrder AS minOrder,
			GROUP_CONCAT(mh.ID ORDER BY mh.ID SEPARATOR ',') AS hID
		FROM flavours f
		
		LEFT JOIN mainheaders mh
			ON mh.flavoursRecId = f.ID
			AND f.Heading = 'Main'
		WHERE f.Heading = 'Main'   
		GROUP BY
			f.ID, f.Heading, f.Type, f.Text, f.Flavours, mh.step, mh.minOrder
		UNION ALL  
		SELECT
			f.ID,
			f.Heading,
			f.Type,
			f.Text,
			f.Flavours,
			sh.step AS step,
			sh.minOrder AS minOrder,
			sh.ID AS hID
		FROM flavours f  
		
		LEFT JOIN subheaders sh
			ON sh.flavoursRecId = f.ID
			AND f.Heading = 'Sub'
			WHERE f.Heading = 'Sub';`,

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
}*/
/*
function updatesFlavours(flavours, headers, column, value, ID){
	console.log(flavours);
	console.log(headers);
	console.log(column);
	console.log(value);
	console.log(ID);
	if(!(flavours === undefined)){
		serverConfig.connection.execute(
			flavours,
			[value, ID],
			function (err, results) {
				if (err) {
					console.log(err);
					return json(new Error(err));
				}
				console.log(`updated ${flavours}`);
				console.log(results);
			}
		)
	}

	if (!(headers === undefined)) {
		serverConfig.connection.execute(
			headers,
			[value, ID],
			function (err, results) {
				if (err) {
					console.log(err);
					return json(new Error(err));
				} 
				console.log(`updated ${headers}`);
				console.log(results);
			}
		)
	}
}*/

function updatesFlavours(flavours, headers, value, ID, done) {
	let pending = 0;
	let failed = false;

	function oneDone(err) {
		if (failed) return;
		if (err) {
			failed = true;
			return done(err);
		}
		pending--;
		if (pending === 0) done(null);
	}
	
	if (flavours !== undefined) {
		pending++;
		serverConfig.connection.execute(flavours, [JSON.stringify(value), ID], oneDone);
	}

	if (headers !== undefined) {
		pending++;
		serverConfig.connection.execute(headers, [JSON.stringify(value), ID], oneDone);
	}

	if (pending === 0) {
		done(null);
	}
}
/*
function addDisableDates(dates, isRange, res) {
	serverConfig.connection.execute(
		'INSERT INTO disableddates (Date, IsRange) VALUES(?, ?);'
		[dates, isRange],
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
};*/

function addDisableDates(dates, isRange = 'No') {
	return new Promise((resolve, reject) => {
		serverConfig.connection.execute(
			'INSERT INTO disableddates (Date, IsRange) VALUES (?, ?)',
			[dates, isRange],
			function (err, results) {
				if (err) return reject(err);
				resolve(results);
			}
		);
	});
}

function removeDisableDates(dates) {
	return new Promise((resolve, reject) => {
		serverConfig.connection.execute(
			'DELETE FROM disableddates WHERE DATE = ?',
			[dates],
			function (err, results) {
				if (err) return reject(err);
				resolve(results);
			}
		);
	});
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
	requestEnquiryByID,
	adminSelect,
	updatesFlavours,
	adminSelectQuery,
	addDisableDates,
	removeDisableDates
}