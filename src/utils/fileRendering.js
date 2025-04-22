const ejs = require('ejs');
const fs = require('fs');
const path = require('path');


function renderTemplate(data, ejsPath){
	const basePath = path.join(__dirname, '../templates/base/', ejsPath);
	const base = fs.readFileSync(basePath, 'utf8');

	let dataArray = data;

	if (ejsPath === 'Flavours.ejs'){
		dataArray = normalizeFlavoursData(data);
	}

	console.log(dataArray)

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

module.exports = {
	saveNewPublicFile
}