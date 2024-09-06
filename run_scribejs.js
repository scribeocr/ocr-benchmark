import fs from 'fs';
import path from 'path';
import scribe from 'scribe.js-ocr';

// Directory containing images
const imgDir = 'img';
// Directory to store .hocr files
const outputDir = 'results/scribejs';

async function processImages() {
  const files = fs.readdirSync(imgDir).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.png' || ext === '.jpeg' || ext === '.jpg';
  });
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  for (const file of files) {
    const filePath = path.join(imgDir, file);
    const outputFilePath = path.join(outputDir, `${path.basename(file, path.extname(file))}.hocr`);
    console.log(`Processing ${file}`);

    // This is intentionally killing the worker with each image so that all results are reproducible and not impacted by previous images.
    // This is inefficient and should be avoided in production code.
    const hocr = await scribe.extractText([filePath], ['eng'], 'hocr');

    await scribe.terminate();

    fs.writeFileSync(outputFilePath, hocr);
  }
}

processImages().catch((err) => console.error(err));
