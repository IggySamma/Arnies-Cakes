const fs = require('fs');
const path = require('path');
const sharp = require('sharp');


const migrateExistingImages = async () => {
	//const dest = serverConfig.isDocker ? globals.publicGallery : globals.devGallery;
	const dest = path.resolve('services/jpg');
	console.log(dest)

	try {
		const allFiles = fs.readdirSync(dest);

		// Only process files that:
		// - have no extension (legacy uploads)
		// - don't already have a -mobile counterpart
		const toProcess = allFiles.filter(filename => {
			//const hasNoExtension = path.extname(filename) === '';
			const hasNoExtension = path.extname(filename) === '.jpg';
			//const isMobile = filename.endsWith('-mobile');
			//return hasNoExtension && !isMobile;
			return hasNoExtension;
		});

		if (toProcess.length === 0) {
			console.log('Migration: No legacy images to process.');
			return;
		}

		console.log(`Migration: Found ${toProcess.length} legacy images to process...`);

		for (const filename of toProcess) {
			const inputPath = path.join(dest, filename);
			/*const outputFull = path.join(dest, `${filename}.jpg`); //Master
			const outputThumb = path.join(dest, `${filename}-thumbnail.jpg`); //4k Thumb
			const outputThumbMid = path.join(dest, `${filename}-thumbnail-mid.jpg`); //1080p/Fast mobile
			const outputThumbLow = path.join(dest, `${filename}-thumbnail-low.jpg`); //Slow pc devices/Mid mobile
			const outputMobileLow = path.join(dest, `${filename}-mobile-low.jpg`); //Slow mobile*/
			const outputFull = path.join(dest, `${filename.replace(/\.jpg$/i, '') }.jpg`); //Master
			const outputThumb = path.join(dest, `${filename.replace(/\.jpg$/i, '') }-thumbnail.jpg`); //4k Thumb
			const outputThumbMid = path.join(dest, `${filename.replace(/\.jpg$/i, '') }-thumbnail-mid.jpg`); //1080p/Fast mobile
			const outputThumbLow = path.join(dest, `${filename.replace(/\.jpg$/i, '') }-thumbnail-low.jpg`); //Slow pc devices/Mid mobile
			const outputMobileLow = path.join(dest, `${filename.replace(/\.jpg$/i, '') }-mobile-low.jpg`); //Slow mobile

			// Skip if already migrated (both versions exist)
			if (fs.existsSync(outputFull) && fs.existsSync(outputThumb) && fs.existsSync(outputThumbMid) && fs.existsSync(outputThumbLow) && fs.existsSync(outputMobileLow)) {
				console.log(`Migration: Skipping ${filename} — already migrated.`);
				continue;
			}

			try {
				const pipeline = sharp(inputPath).rotate();

				//Master
				if (!fs.existsSync(outputFull)) {
					await pipeline
						.clone()
						.toFormat('jpeg', {
							//quality: 85,
							quality: 100,
							mozjpeg: true,
							chromaSubsampling: '4:4:4',
						})
						.toFile(outputFull);
				}

				//4k Thumb
				if (!fs.existsSync(outputThumb)) {
					await pipeline
						.clone()
						.resize({
							width: 3600,
							height: 3600,
							fit: 'inside',
							withoutEnlargement: true,
						})
						.toFormat('jpeg', {
							quality: 85,
							mozjpeg: true,
							chromaSubsampling: '4:2:0',
						})
						.toFile(outputThumb);
				}

				//1080p/Fast mobile
				if (!fs.existsSync(outputThumbMid)) {
					await pipeline
						.clone()
						.resize({
							width: 2400,
							height: 2400,
							fit: 'inside',
							withoutEnlargement: true,
						})
						.toFormat('jpeg', {
							quality: 75,
							mozjpeg: true,
							chromaSubsampling: '4:2:0',
						})
						.toFile(outputThumbMid);
				}
				
				//Slow pc devices/Mid mobile
				if (!fs.existsSync(outputThumbLow)) {
					await pipeline
						.clone()
						.resize({
							width: 1400,
							height: 1400,
							fit: 'inside',
							withoutEnlargement: true,
						})
						.toFormat('jpeg', {
							quality: 65,
							mozjpeg: true,
							chromaSubsampling: '4:2:0',
						})
						.toFile(outputThumbLow);
				}
				//Slow mobile
				if (!fs.existsSync(outputMobileLow)) {
					await pipeline
						.clone()
						.resize({
							width: 1100,
							height: 1100,
							fit: 'inside',
							withoutEnlargement: true,
						})
						.toFormat('jpeg', {
							quality: 60,
							mozjpeg: true,
							chromaSubsampling: '4:2:0',
						})
						.toFile(outputMobileLow);
				}


				console.log(`Migration: Processed ${filename}`);
			} catch (err) {
				// Don't let one bad file kill the whole migration
				console.error(`Migration: Failed to process ${filename} —`, err.message);
			}
		}

		console.log('Migration: Complete.');
	} catch (err) {
		console.error('Migration: Fatal error —', err.message);
	}
};
/*
const migrateDirectory = async (targetDir) => {
	const processDir = async (dir) => {
		try {
			console.log(`Migration: Scanning — ${dir}`);

			const entries = fs.readdirSync(dir, { withFileTypes: true });

			console.log(`Migration: Found ${entries.length} entries in ${dir}`);
			entries.forEach(e =>
				console.log(`  ${e.isDirectory() ? '[DIR]' : '[FILE]'} ${e.name}`)
			);

			// Recurse into subfolders
			for (const entry of entries) {
				if (entry.isDirectory()) {
					await processDir(path.join(dir, entry.name));
				}
			}

			const toProcess = entries
				.filter(entry => entry.isFile())
				.map(entry => entry.name)
				.filter(filename => {
					const lower = filename.toLowerCase();

					return (
						(lower.endsWith('.jpg') ||
							lower.endsWith('.jpeg') ||
							lower.endsWith('.png')) &&
						!lower.endsWith('-mobile.jpg')
					);
				});

			if (toProcess.length === 0) {
				console.log(`Migration: No images to process in ${dir}`);
				return;
			}

			console.log(
				`Migration: Found ${toProcess.length} images to process in ${dir}`
			);

			for (const filename of toProcess) {
				const inputPath = path.join(dir, filename);
				const ext = path.extname(filename).toLowerCase();
				const isJpeg = ext === '.jpg' || ext === '.jpeg';

				const baseName = path.parse(filename).name;
				const outputPath = path.join(dir, `${baseName}.jpg`);
				const outputMobile = path.join(dir, `${baseName}-mobile.jpg`);

				if (fs.existsSync(outputMobile)) {
					console.log(
						`Migration: Skipping ${filename} — mobile already exists.`
					);
					continue;
				}

				try {
					const pipeline = sharp(inputPath).rotate();

					// Recompress JPEGs or convert PNGs to JPG
					const tempOutput = path.join(dir, `${baseName}.tmp.jpg`);

					await pipeline
						.clone()
						.jpeg({
							quality: 85,
							mozjpeg: true,
							chromaSubsampling: '4:4:4',
						})
						.toFile(tempOutput);

					if (isJpeg) {
						fs.renameSync(tempOutput, inputPath);
						console.log(`Migration: Compressed — ${filename}`);
					} else {
						fs.renameSync(tempOutput, outputPath);
						console.log(`Migration: Created full — ${baseName}.jpg`);
					}

					await pipeline
						.clone()
						.resize({
							width: 1440,
							height: 1440,
							fit: 'inside',
							withoutEnlargement: true,
						})
						.jpeg({
							quality: 75,
							mozjpeg: true,
							chromaSubsampling: '4:2:0',
						})
						.toFile(outputMobile);

					console.log(
						`Migration: Created mobile — ${baseName}-mobile.jpg`
					);
				} catch (err) {
					console.error(
						`Migration: Failed to process ${filename} in ${dir} —`,
						err.message
					);
				}
			}
		} catch (err) {
			console.error(`Migration: Fatal error in ${dir} —`, err.message);
		}
	};

	console.log(`Migration: Starting in ${targetDir}`);
	await processDir(targetDir);
	console.log(`Migration: Complete for ${targetDir}`);
};


const migrateDirectoryPNG = async (targetDir) => {
	const processDir = async (dir) => {
		try {
			console.log(`Migration: Scanning — ${dir}`);

			const entries = fs.readdirSync(dir, { withFileTypes: true });

			// Recurse into subfolders
			for (const entry of entries) {
				if (entry.isDirectory()) {
					await processDir(path.join(dir, entry.name));
				}
			}

			const toProcess = entries
				.filter(entry => entry.isFile())
				.map(entry => entry.name)
				.filter(filename => {
					const lower = filename.toLowerCase();

					return (
						lower.endsWith('.png') &&
						!lower.endsWith('-mobile.png')
					);
				});

			if (toProcess.length === 0) {
				return;
			}

			console.log(
				`Migration: Found ${toProcess.length} PNGs to process in ${dir}`
			);

			for (const filename of toProcess) {
				const inputPath = path.join(dir, filename);
				const baseName = path.parse(filename).name;

				const outputMobile = path.join(
					dir,
					`${baseName}-mobile.png`
				);

				if (fs.existsSync(outputMobile)) {
					console.log(
						`Migration: Skipping ${filename} — mobile already exists`
					);
					continue;
				}

				try {
					const pipeline = sharp(inputPath).rotate();

					// Compress original PNG in-place
					const tempOriginal = path.join(
						dir,
						`${baseName}.tmp.png`
					);

					await pipeline
						.clone()
						.png({
							compressionLevel: 9,
							palette: true,
							effort: 10,
						})
						.toFile(tempOriginal);

					fs.renameSync(tempOriginal, inputPath);

					console.log(
						`Migration: Compressed original — ${filename}`
					);

					// Create mobile PNG
					await pipeline
						.clone()
						.resize({
							width: 1440,
							height: 1440,
							fit: 'inside',
							withoutEnlargement: true,
						})
						.png({
							compressionLevel: 9,
							palette: true,
							effort: 10,
						})
						.toFile(outputMobile);

					console.log(
						`Migration: Created mobile — ${baseName}-mobile.png`
					);
				} catch (err) {
					console.error(
						`Migration: Failed to process ${filename} in ${dir} —`,
						err.message
					);
				}
			}
		} catch (err) {
			console.error(
				`Migration: Fatal error in ${dir} —`,
				err.message
			);
		}
	};

	console.log(`Migration: Starting in ${targetDir}`);
	await processDir(targetDir);
	console.log(`Migration: Complete for ${targetDir}`);
};
*/

// -- Image compression Manually --//
//migrateDirectory(path.resolve('services/jpg')); // ~  Directory to copy jpg files, compress and make mobile versions

//migrateDirectoryPNG(path.resolve('public/images/Compress')); // ~  Directory to copy png files, compress and make mobile versions

//migrateExistingImages();
module.exports = {
	migrateExistingImages/*,
	migrateDirectory,
	migrateDirectoryPNG*/
}