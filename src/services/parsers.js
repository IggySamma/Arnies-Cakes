const utils = require('../utils/coreUtils.js');
const globals = require('../globals/globals.js');
const sqlQuery = require('./sql.js');
const serverConfig = require('../config/config.js');
const fs = require('fs');
const multer = require("multer");
const { text } = require('body-parser');
const templates = require('../utils/fileRendering.js');

/*------------------------------- Gallery ------------------------------------*/

function getAllFromGallery() { /*This functions duplicated in sql.js*/
	globals.gallery = undefined;
	globals.gallery = new globals.galleryConstructor;

	serverConfig.connection.execute(
		'SELECT * FROM gallery ORDER BY ID ASC;',
		function (err, results) {
			if(err){
				res.json(new Error(err));
			}else{
				globals.gallery = JSON.parse(JSON.stringify(results));
			}
		}
	);
}

const galleryUpload = multer({ 
    	//dest: "./public/gallery", //Dev
	//dest: globals.publicGallery, //Docker
	dest: serverConfig.isDocker ? globals.publicGallery : globals.devGallery,
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(png|PNG|jpg|JPG|jpeg|JPEG)$/)){
		cb(new Error('Please upload an image.'));
		}
		cb(undefined, true);
	},
});

const clientUpload = multer({
    fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(png|PNG|jpg|JPG|jpeg|JPEG)$/)){
           	cb(new Error('Please upload an image of the correct format.'), false);
        	}
            	cb(undefined, true);
    },
});

const multerParser = multer();

function uploadFiles(req, res) {
    for (var i = 0; i < req.files.length; i++) {
        sqlQuery.insertNewToGallery(req.body.name, "/gallery/" + req.files[i].filename);
    }
    getAllFromGallery();
    res.redirect('/admin')
}

async function deleteFromGallery(req, res){
    	let data = req.body;
    	//let path = '/gallery/' + data.Path //local
	let path = '/gallery/' + data.Path //Docker
	let unlinkPath = serverConfig.isDocker ? globals.publicGallery : globals.devGallery;

	try {
		let exists = await sqlQuery.checkGalleryByID(data.ID, path);
		//'public/gallery/' //local
		if (exists) {
			fs.unlink(unlinkPath + data.Path, (err) => {
				if (err) {
					console.error("Failed to delete file. Path requested + Error: ", unlinkPath + data.Path + err);
				} else {
					console.log("File deleted successfully. Path requested:", unlinkPath + data.Path);
				}
			});
			await sqlQuery.deleteFromGalleryByID(data.ID, res);
		} else {
			res.sendStatus(500)
		}
	} catch (error) {
		console.log("Error: ", error);
		res.sendStatus(500);
	}
};


/*------------------------------- Enquiries ------------------------------------*/

function isNotEmptyEnquirie(data){
    let adjData = {};
    for (var i = 0; i < Object.keys(data).length; i++) {
        if (Object.values(data)[i] != "" && Object.values(data)[i] != "0") {
            adjData[Object.keys(data)[i]] = Object.values(data)[i];         
        }
    };
    return adjData;
};

function EnquiriesValidation(value1, value2){
    let emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let numberRegEx = /^(?:08\d{8}|\+3538\d{8})$/;

    return  value1.match(emailRegEx) === null ? "email" :
            value2.match(numberRegEx) === null ? "number" : "";
}

function Enquiries(req, res){
    let photos = req.files;
    
    let adjData = isNotEmptyEnquirie(JSON.parse(JSON.stringify(req.body)));

    return EnquiriesValidation(adjData.Email, adjData.Number) === "email" ? res.sendStatus(405) : 
            EnquiriesValidation(adjData.Email, adjData.Number) === "number" ? res.sendStatus(406) : 
            photos === undefined ? res.sendStatus(407) : attachTextBody(adjData, photos, res);
};


function attachTextBody(adjData, photos, res){
    let textBody = ""; 
    let date = ""
    let start = false;
    let finish = false;

    let tableHeader = {
        "Item": "Item",
        "Quantity": "Quantity",
        "Flavour": "Flavour",
        "Cake Size": "Cake Size",
    }
    let tableData = {
        "Item": [],
        "Quantity": [],
        "Flavour": [],
        "Cake Size": [],
    }

    if("Date of collection" in adjData){
        date = adjData["Date of collection"]
    } else if("Date of delivery" in adjData){
        date = adjData["Date of delivery"]
    }
    
    for (let i = 0; i < Object.keys(adjData).length; i++) {
        if(Object.keys(adjData)[i] == "Order"){
            const orderList = Object.values(adjData)[i];
            const orders = Array.isArray(orderList) ? orderList : [orderList];
            
            orders.forEach(order => {
                const orderObj = JSON.parse(order);
                for (const [key, value] of Object.entries(orderObj)) {
                    if (key in tableData) {
                        finish = false;
                        start = true;
                        tableData[key].push(value);
                    }
                    finish = true;
                }
            });


            if (start && finish) {
                let activeKeys = Object.keys(tableData).filter(key => tableData[key].length > 0);
                const maxLength = Math.max(...activeKeys.map(key => tableData[key].length));

                textBody = textBody + '<table>';
                
                for (const key of Object.keys(activeKeys)) {
                    textBody += '<th>' + Object.keys(tableHeader)[key] + '</th>';
                }
                
                for (let i = 0; i < maxLength; i++) {
                    textBody += '<tr>';
                    for (const key of activeKeys) {
                        textBody += '<td>' + (tableData[key][i] || "") + '</td>';
                    }
                    textBody += '</tr>';
                }
                textBody += '</table>';
            }
        } else {
            textBody += "<p><strong>" + Object.keys(adjData)[i] + ":</strong> " + Object.values(adjData)[i] + "</p>";
        }
    }

    sqlQuery.storeNewEnquirie(res, adjData, sqlQuery.getAllEnquiries).then(ID => {
        utils.sendEmails(ID[ID.length -1].ID, adjData, textBody, photos, res, date);
    })
}
/*------------------------------- Flavours ------------------------------------*/

function getFlavours(){
   serverConfig.connection.execute(
        'SELECT * FROM flavours;',
        function (err, results) {
            if (err) {
                console.log(err);
            } else {
                storeFlavours(JSON.parse(JSON.stringify(results)));
            }
        }
   );
}


function storeFlavours(data){
	globals.flavours = new globals.flavoursConstructor;

	const re = new RegExp(/["\[\]]|null/g)

	for(let i = 0; i < data.length; i++){
		globals.flavours.ID.push(data[i].ID);
		globals.flavours.Heading.push(data[i].Heading);
		globals.flavours.Type.push(String(data[i].Type).replace(re,"").split(","));
		globals.flavours.Text.push(String(data[i].Text).replace(re,"").split(","));
		globals.flavours.Flavours.push(String(data[i].Flavours).replace(re,"").split(","));
	}

    	//console.log("Flavours stored");
	serverConfig.rebuildAllPages && templates.saveNewPublicFile('Flavours.html', globals.flavours, 'Flavours.ejs');
	serverConfig.rebuildAllPages && getEnquiriesHeadersPreRender()
}

/*------------------------------- Enquiries ------------------------------------*/

function getEnquiriesHeadersPreRender() {
	serverConfig.connection.execute(
		'SELECT * FROM mainheaders;',
		function (err, results) {
			if (err) {
				console.log(err);
				res.json(new Error(err));
			} else {
				const obj = JSON.parse(JSON.stringify(results));
				
				const header = obj.map(item => ({
					...item, 
					Header: 'Main'
				}));
				getEnquiriesSubHeadersPreRender(header);
			}
		}
	);
}


function getEnquiriesSubHeadersPreRender(main) {
	serverConfig.connection.execute(
		'SELECT * FROM subheaders;',
		function (err, results) {
			if (err) {
				console.log(err);
				res.json(new Error(err));
			} else {
				var obj = JSON.parse(JSON.stringify(results));
				//console.log(obj)
				const sub = obj.map( item => ({
					...item,
					Header: 'Sub'
				}));

				const headers = [...main, ...sub];
				//console.log(headers)
				serverConfig.rebuildAllPages && templates.saveNewPublicFile('Enquiries.html', headers, 'Enquiries.ejs')
			}
		}
	);
}

/*------------------------------- Enquiries Calendar ------------------------------------*/

function getDisabledDates(){
   serverConfig.connection.execute(
        'SELECT * FROM disableddates;',
        function (err, results) {
            if (err) {
                console.log(err)
            } else {
                storeDisabledDates(JSON.parse(JSON.stringify(results)));
            }
        }
   );
}


function storeDisabledDates(data){
    globals.disabledDates = new globals.disabledDatesContructor
    for(let i = 0; i < data.length; i++){
        if(data[i].IsRange === "Yes"){
            let tempObj = {
                "from": data[i].Date.slice(0, 10),
                "to": data[i].Date.slice(11, 22)
            }
            globals.disabledDates.ID.push(data[i].ID);
            globals.disabledDates.Date.push(tempObj);
            globals.disabledDates.IsRange.push(data[i].IsRange);
        } else {
            globals.disabledDates.ID.push(data[i].ID);
            globals.disabledDates.Date.push(data[i].Date.slice(0, 10));
            globals.disabledDates.IsRange.push(data[i].IsRange);
        }
    }
    checkDates();
    console.log("Disabled dates stored")
    checkMinimumDate()
}

function checkDates(){
    let today = new Date(new Date().setDate(new Date().getDate() /* + 3 */)).toISOString().split('T')[0];
    for(let i = 0; i < globals.disabledDates.ID.length; i++){
        if(globals.disabledDates.IsRange[i] === "Yes") {
            if(today >= globals.disabledDates.Date[i].to){
                deleteDates(globals.disabledDates.ID[i]);
            }
        } else {
            if(today >= globals.disabledDates.Date[i]){
                deleteDates(globals.disabledDates.ID[i]);
            }
        }
    }
    console.log("Disabled dates cleaned up")
};


function deleteDates(ID){
    serverConfig.connection.execute(
        'DELETE FROM disableddates WHERE ID= ?;', 
        [ID],
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                getDisabledDates();
                console.log("Deleted old disabled date ID: " + ID);
            }
        }
    );
}

function checkMinimumDate(){
    let minDate = new Date(new Date().setDate(new Date().getDate() + 3 )).toISOString().split('T')[0]
    let i = 0
    let usedDates = []

    for(let i = 0; i < globals.disabledDates.ID.length; i++){
        globals.disabledDates.IsRange[i] === "Yes" ? 
        createDateArrayFromDateRanges(globals.disabledDates.Date[i].from, globals.disabledDates.Date[i].to).forEach((day) => {usedDates.push(day)}) :
        usedDates.push(globals.disabledDates.Date[i]);
    }

    while(usedDates.includes(minDate) === true){
        minDate = new Date(new Date().setDate(new Date().getDate() + 3 + i)).toISOString().split('T')[0]
        i++
    }
    globals.disabledDates.MinDate = minDate
    console.log("Min Date for disabled dates set as: " + minDate)
}

function createDateArrayFromDateRanges(fromString, toString){
    let i = -1
    let from = new Date(new Date(fromString).setDate(new Date(fromString).getDate())).toISOString().split('T')[0]
    let to = new Date(new Date(toString).setDate(new Date(toString).getDate())).toISOString().split('T')[0]
    let dateRange = []
    while(from < to){
        i++
        from = new Date(new Date(fromString).setDate(new Date(fromString).getDate() + i)).toISOString().split('T')[0]
        dateRange.push(from)
    }
    return dateRange
}

/*------------------------------- Admin Page Functions ------------------------------------*/

function adminUpdateFlavours(req, res){
	
	let buffer = JSON.parse(JSON.stringify(req.body));
	let counter;
	console.log(buffer);
	if(('Heading' in buffer) && ('HID' in buffer)){
		if ('Type' in buffer) {
			//console.log(parseSpaces(buffer['Type']));
			sqlQuery.updateFlavours(
				buffer['Heading'], 
				buffer['HID'], 
				'Type', 
				parseSpaces(buffer['Type'])
			);
		}
		if ('Flavours' in buffer) {
			//console.log(parseSpaces(buffer['Flavours']));
			//console.log(splitIntoArray(parseSpaces(buffer['Flavours']), ','));
			sqlQuery.updateFlavours(
				buffer['Heading'], 
				buffer['HID'], 
				'Flavours', 
				splitIntoArray(parseSpaces(buffer['Flavours']), ',')
			);
		}
		if ('Text' in buffer) {
			//console.log(parseSpaces(buffer['Text']));
			//console.log(splitIntoArray(parseSpaces(buffer['Text']), ','));
			sqlQuery.updateFlavours(
				buffer['Heading'],
				buffer['HID'],
				'Flavours',
				splitIntoArray(parseSpaces(buffer['Text']), ',')
			);
		}
		if ('MinOrder' in buffer) {
			//console.log(parseSpaces(buffer['MinOrder']));
			sqlQuery.updateFlavours(
				buffer['Heading'], 
				buffer['HID'], 
				'minOrder', 
				parseSpaces(buffer['MinOrder'])
			);
		}
		if ('Step' in buffer) {
			//console.log(parseSpaces(buffer['Step']));
			sqlQuery.updateFlavours(
				buffer['Heading'], 
				buffer['HID'], 
				'Step', 
				parseSpaces(buffer['Step'])
			);
		}
	}

	//res.sendStatus(200);
}

function splitIntoArray(buffer, sChar) {
	if(buffer.length > 0) {
		if(buffer.includes(sChar)) {
			let tA = [];
			let s = buffer.split(sChar);
			s.forEach( i => {
				tA.push(i)
			})
			return s
		} else {
			return buffer
		}

	} else {
		return buffer
	}
}

function parseSpaces(buffer){
	buffer = buffer
		.replace(/[\n\r\t]+/g, '')   // remove line breaks & tabs
		.replace(/ {2,}/g, ' ')      // collapse multiple spaces
		.replace(/\s*,\s*/g, ',')    // remove spaces around commas
		.trim();
	
	return buffer;
}

/*------------------------------- Bootup ------------------------------------*/

getDisabledDates();
getAllFromGallery();
getFlavours();

module.exports = {
	galleryUpload,
	clientUpload,
	isNotEmptyEnquirie,
	Enquiries,
	uploadFiles,
	deleteFromGallery,
	getAllFromGallery,
	adminUpdateFlavours,
	multerParser
}