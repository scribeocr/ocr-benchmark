import fs from 'fs';
import path from 'path';
import scribe from 'scribe.js-ocr';

// Set evaluation options
scribe.opt.ignorePunct = true;

// Directory containing images
const truthDir = 'ground_truth';

/** @type {Parameters<typeof scribe.compareOCR>[2]} */
const compOptions = {
  ignorePunct: scribe.opt.ignorePunct,
  ignoreCap: scribe.opt.ignoreCap,
  confThreshHigh: scribe.opt.confThreshHigh,
  confThreshMed: scribe.opt.confThreshMed,
};

/**
 *
 * @param {string} compDir
 */
async function evalOCR(compDir) {
  const evalStatsDocArr = [];

  const files = fs.readdirSync(truthDir);

  const comp = path.basename(compDir);

  for (const file of files) {
    const filePathTruth = path.join(truthDir, file);

    const filePathComp = path.join(compDir, file.replace(/\.truth\.hocr/, '.hocr'));

    if (!fs.existsSync(filePathComp)) {
      console.log(`Skipping comparison due to missing file: ${file}`);
      continue;
    }

    await scribe.importFiles([filePathComp]);
    await scribe.importFilesSupp([filePathTruth], 'Ground Truth');

    const res = await scribe.compareOCR(scribe.data.ocr.active, scribe.data.ocr['Ground Truth'], compOptions);

    let evalStatsDoc = scribe.utils.calcEvalStatsDoc(res.metrics);

    evalStatsDoc = {
      file: file,
      ...evalStatsDoc,
    }

    evalStatsDocArr.push(evalStatsDoc);

    await scribe.terminate();
  }

  const csvStr = scribe.utils.convertToCSV(evalStatsDocArr);

  fs.writeFileSync(`stats/eval_stats_${comp}.csv`, csvStr);
}

const arg = process.argv[2];
evalOCR(arg).catch((err) => console.error(err));
