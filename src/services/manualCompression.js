const fs = require('fs');
const path = require('path');
const sharp = require('sharp');


const migrateExistingImages = async () => {
	const dest = serverConfig.isDocker ? globals.publicGallery : globals.devGallery;

	try {
		const allFiles = fs.readdirSync(dest);

		// Only process files that:
		// - have no extension (legacy uploads)
		// - don't already have a -mobile counterpart
		const toProcess = allFiles.filter(filename => {
			const hasNoExtension = path.extname(filename) === '';
			const isMobile = filename.endsWith('-mobile');
			return hasNoExtension && !isMobile;
		});

		if (toProcess.length === 0) {
			console.log('Migration: No legacy images to process.');
			return;
		}

		console.log(`Migration: Found ${toProcess.length} legacy images to process...`);

		for (const filename of toProcess) {
			const inputPath = path.join(dest, filename);
			const outputPath = path.join(dest, `${filename}.jpg`);
			const outputMobile = path.join(dest, `${filename}-mobile.jpg`);

			// Skip if already migrated (both versions exist)
			if (fs.existsSync(outputPath) && fs.existsSync(outputMobile)) {
				console.log(`Migration: Skipping ${filename} — already migrated.`);
				continue;
			}

			try {
				const pipeline = sharp(inputPath).rotate();

				// Full quality version — same name + .jpg
				if (!fs.existsSync(outputPath)) {
					await pipeline
						.clone()
						.toFormat('jpeg', {
							quality: 85,
							mozjpeg: true,
							chromaSubsampling: '4:4:4',
						})
						.toFile(outputPath);
				}

				// Mobile version — same name + -mobile.jpg
				if (!fs.existsSync(outputMobile)) {
					await pipeline
						.clone()
						.resize({
							width: 1440,
							height: 1440,
							fit: 'inside',
							withoutEnlargement: true,
						})
						.toFormat('jpeg', {
							quality: 75,
							mozjpeg: true,
							chromaSubsampling: '4:2:0',
						})
						.toFile(outputMobile);
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


// -- Image compression Manually --//
//migrateDirectory(path.resolve('public/images/Compress')); // ~  Directory to copy jpg files, compress and make mobile versions

//migrateDirectoryPNG(path.resolve('public/images/Compress')); // ~  Directory to copy png files, compress and make mobile versions

//migrateExistingImages();
