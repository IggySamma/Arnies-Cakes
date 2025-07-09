const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const serverConfig = require('../config/config.js');

function renderTemplate(data, ejsPath){
	const basePath = path.join(__dirname, '../templates/base/', ejsPath);
	const base = fs.readFileSync(basePath, 'utf8');

	let dataArray = data;
	
	if (ejsPath === 'Flavours.ejs'){
		dataArray = normalizeFlavoursData(data);
	}

	//console.log(dataArray)
	
	return ejs.render(base, {
		filename: basePath,
		entries: dataArray
	})
}

function normalizeFlavoursData(data) {
	return data.ID.map((_, i) => ({
		id: data.ID[i],
		heading: data.Heading[i],
		type: data.Type[i],
		text: data.Text[i],
		flavours: data.Flavours[i]
	}));
}

function saveNewPublicFile(ogFile, data, ejsPath){
	const htmlOutput = renderTemplate(data, ejsPath);

	try{
		fs.renameSync(path.join(__dirname, '../public/', ogFile), path.join(__dirname, '../templates/backup/', ogFile));
	} catch (err) {
		console.log(`${ogFile} doesn't exist`);
		console.log(err);
		return;
	}
	
	try{
		fs.writeFileSync(`../src/public/${ogFile}`, htmlOutput);
		console.log('Creating file: ' + ogFile)
	} catch (err) {
		console.log(`Issue with creating from ${ejsPath} template, check exists`);
		console.log(err);

		try{
			fs.renameSync(path.join(__dirname, '../templates/backup/', ogFile), path.join(__dirname, '../public/', ogFile));
		} catch (error) {
			throw new Error(`Critrical error, couldn't return moved original file, please replace ${ogFile}. \n ${error}`)

		}
		return;
	}
	
}

serverConfig.rebuildAllPages && saveNewPublicFile('Index.html', [], 'Index.ejs');
serverConfig.rebuildAllPages && saveNewPublicFile('About.html', [] , 'About.ejs');
serverConfig.rebuildAllPages && saveNewPublicFile('Gallery.html', [], 'Gallery.ejs');
//saveNewPublicFile('Flavours.html', getFlavours(), 'Flavours.ejs'); // parsers.js storeFlavours(data) as it needs to be run after stored
//saveNewPublicFile('Enquiries.html', [], 'Enquiries.ejs'); // parsers.js getEnquiriesSubHeadersPreRender(main) as it needs to be run after stored

module.exports = {
	saveNewPublicFile
}