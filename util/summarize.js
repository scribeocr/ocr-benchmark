import fs from 'fs';

/**
 * Reads a CSV file and returns arrays of file names and percent correct values per row.
 * @param {string} filePath - Path to the CSV file.
 * @returns {Promise<Object>} - Promise resolving to an object containing arrays of file names and percent correct values.
 */
function readAndExtractData(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const lines = data.split('\n').filter(line => line);
      const fileNames = [];
      const percentages = [];

      for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(',');
        const file = columns[0].trim().replace(/"/g, '');
        const total = parseInt(columns[1], 10);
        const correct = parseInt(columns[2], 10);
        const percentCorrect = (correct / total) * 100;

        fileNames.push(file);
        percentages.push(percentCorrect);
      }

      resolve({ fileNames, percentages });
    });
  });
}

/**
 * Compares the percent correct values from two CSV files based on file names.
 * @param {string} filePath1 - Path to the first CSV file.
 * @param {string} filePath2 - Path to the second CSV file.
 * @returns {Promise<void>} - Promise resolving when the comparison is printed.
 */
async function compareCSVFiles(filePath1, filePath2) {
  try {
    const data1 = await readAndExtractData(filePath1);
    const data2 = await readAndExtractData(filePath2);

    let markdown = '| file | percent correct in first file | percent correct in second file | difference |\n';
    markdown += '| --- | --- | --- | --- |\n';

    let totalDifference = 0;
    let totalPercent1 = 0;
    let totalPercent2 = 0;

    for (let i = 0; i < data1.percentages.length; i++) {
      const difference = (data2.percentages[i] - data1.percentages[i]).toFixed(2);
      totalPercent1 += data1.percentages[i];
      totalPercent2 += data2.percentages[i];
      totalDifference += parseFloat(difference);

      markdown += `| ${data1.fileNames[i]} | ${data1.percentages[i].toFixed(2)}% | ${data2.percentages[i].toFixed(2)}% | ${difference}% |\n`;
    }

    const avgPercent1 = (totalPercent1 / data1.percentages.length).toFixed(2);
    const avgPercent2 = (totalPercent2 / data2.percentages.length).toFixed(2);
    const avgDifference = (totalDifference / data1.percentages.length).toFixed(2);

    markdown += `| **Average** | **${avgPercent1}%** | **${avgPercent2}%** | **${avgDifference}%** |\n`;

    console.log(markdown);
  } catch (error) {
    console.error('Error:', error);
  }
}

const arg1 = process.argv[2];
const arg2 = process.argv[3];

compareCSVFiles(arg1, arg2);
