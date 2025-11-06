const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgDir = path.join(__dirname, '../public/icons/svg');
const pngDirs = {
  '1x': path.join(__dirname, '../public/icons/png/1x'),
  '2x': path.join(__dirname, '../public/icons/png/2x'),
  '3x': path.join(__dirname, '../public/icons/png/3x')
};

const sizes = {
  '1x': 24,
  '2x': 48,
  '3x': 72
};

async function convertSvgToPng() {
  // Ensure PNG directories exist
  Object.values(pngDirs).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Read all SVG files
  const svgFiles = fs.readdirSync(svgDir).filter(file => file.endsWith('.svg'));

  console.log(`Found ${svgFiles.length} SVG files to convert...`);

  for (const svgFile of svgFiles) {
    const svgPath = path.join(svgDir, svgFile);
    const baseName = path.basename(svgFile, '.svg');

    console.log(`Converting ${svgFile}...`);

    for (const [scale, size] of Object.entries(sizes)) {
      const outputPath = path.join(pngDirs[scale], scale === '1x' 
        ? `${baseName}.png` 
        : `${baseName}@${scale}.png`);

      try {
        await sharp(svgPath)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .png()
          .toFile(outputPath);

        console.log(`  ✓ Created ${outputPath}`);
      } catch (error) {
        console.error(`  ✗ Error converting ${svgFile} at ${scale}:`, error.message);
      }
    }
  }

  console.log('\nConversion complete!');
}

convertSvgToPng().catch(console.error);

