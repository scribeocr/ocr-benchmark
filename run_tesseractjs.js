import fs from 'fs';
import path from 'path';
import { createWorker } from 'tesseract.js';

// Directory containing images
const imgDir = 'img';
// Directory to store .hocr files
const outputDirLegacy = 'results/tesseractjs_legacy';
const outputDirLSTM = 'results/tesseractjs_lstm';

// This is intentionally creating a new worker for each image so that all results are reproducible and not impacted by previous images.
// This is inefficient and should be avoided in production code.
async function recognizeImage(imagePath, lstm = true) {
  const oem = lstm ? 1 : 0;
  const worker = await createWorker('eng', oem);
  await worker.setParameters({
    tessedit_pageseg_mode: '3',
  });
  const {
    data: { hocr },
  } = await worker.recognize(imagePath);

  await worker.terminate();

  return hocr;
}

async function processImages(lstm = true) {
  const files = fs.readdirSync(imgDir).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.png' || ext === '.jpeg' || ext === '.jpg';
  });
  const outputDir = lstm ? outputDirLSTM : outputDirLegacy;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  for (const file of files) {
    const filePath = path.join(imgDir, file);

    const outputFilePath = path.join(outputDir, `${path.basename(file, path.extname(file))}.hocr`);
    const hocrContent = await recognizeImage(filePath);
    fs.writeFileSync(outputFilePath, hocrContent);
  }
}

processImages(true).catch((err) => console.error(err));
processImages(false).catch((err) => console.error(err));
