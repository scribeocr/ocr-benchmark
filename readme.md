# Overview
This repo contains images and code for benchmarking OCR programs.  This benchmark was created to evaluate Tesseract.js and Scribe.js, however it can be used with any OCR program that exports to a supported format (`.hocr` or Abbyy `.xml`).

The corpus of images aims to be small yet diverse, allowing for testing a wide variety of real-world use cases with minimal runtime.  The goal is to include a handful of every document type (e.g. book, academic paper, magazine), document layout (e.g. single column, multi-column, table), and scanning condition (e.g. screenshot, high-resolution scan, low-resolution scan).  This stands in contrast with many other benchmark corpuses, which often include a large number of homogenous documents that essentially test the same case.

# Recent Results
A summary of recent benchmark results comparing between Tesseract.js and Scribe.js are below.  Note that this is an intentionally difficult benchmark intended to compare between OCR programs.  The average accuracy statistics should not be compared with numbers reported by other benchmarks, and are not indicative of real-world performance with high-quality document scans.  Both Tesseract.js and Scribe.js routinely achieve >97% accuracy with high-quality inputs.

| file | Tesseract.js Accuracy | Scribe.js Accuracy | Difference |
| --- | --- | --- | --- |
| bill.truth.hocr | 96.63% | 98.88% | 2.25% |
| chart_1.truth.hocr | 86.71% | 89.87% | 3.16% |
| chart_2.truth.hocr | 83.51% | 89.69% | 6.19% |
| deposition_1.truth.hocr | 94.15% | 99.65% | 5.50% |
| deposition_2.truth.hocr | 97.88% | 97.88% | 0.00% |
| filing_1.truth.hocr | 100.00% | 98.91% | -1.09% |
| filing_3.truth.hocr | 97.68% | 98.84% | 1.16% |
| form_1.truth.hocr | 58.46% | 56.92% | -1.54% |
| multicol_1.truth.hocr | 89.38% | 91.86% | 2.48% |
| multicol_2.truth.hocr | 90.70% | 95.20% | 4.50% |
| multicol_3.truth.hocr | 89.34% | 95.13% | 5.79% |
| multicol_4.truth.hocr | 90.59% | 92.82% | 2.23% |
| multicol_5.truth.hocr | 91.76% | 93.54% | 1.78% |
| multicol_6.truth.hocr | 87.62% | 93.73% | 6.11% |
| multicol_7.truth.hocr | 87.19% | 95.41% | 8.22% |
| receipt_3.truth.hocr | 98.36% | 96.72% | -1.64% |
| slide_1.truth.hocr | 95.51% | 96.15% | 0.64% |
| table_1.truth.hocr | 85.62% | 86.73% | 1.11% |
| table_4.truth.hocr | 44.07% | 60.74% | 16.67% |
| table_5.truth.hocr | 49.82% | 90.84% | 41.03% |
| table_7.truth.hocr | 55.70% | 92.41% | 36.71% |
| table_8.truth.hocr | 97.56% | 99.09% | 1.52% |
| table_9.truth.hocr | 96.90% | 97.24% | 0.34% |
| **Average** | **85.44%** | **91.66%** | **6.22%** |


# Running
### Generating HOCR for Test Corpus
Scripts are provided to run OCR on the test corpus and generate `.hocr` files for Tesseract.js and Scribe.js.  Running using another program will require writing your own script.  Each set of results should be saved in a subdirectory within the `results` folder.  For example, `results/scribejs` contains the `.hocr` files produced by Scribe.js.

```sh
node run_scribejs.js
node run_tesseractjs.js
```

### Compare OCR to Ground Truth
Directories of `.hocr` data are compared to the ground truth versions by running the `run_eval.js` script.

```sh
node run_eval.js results/scribejs
node run_eval.js results/tesseractjs_lstm
```
The results are saved as `.csv` files in the `stats` directory.

# Scope
The corpus may include all printed documents that a user may need to digitize using OCR.  This includes most document types--books, forms, receipts, newspapers, etc. 

The following types of images are **outside** the scope of this project.  In all cases, these document types are excluded because they present unique/specific challenges that are not broadly applicable to general document digitization use-cases. 
- Handwritten text
	- Most OCR programs do not work with handwritten text, and do not claim to support it.
- CAPTCHAs
	- CAPTCHAs are deliberately designed to be adversarial to common OCR programs.
- Extremely low-quality images.
	- While the corpus intentionally includes many scans of medium and low quality, all documents could plausibly be encountered within a document scanning workflow (and most were taken from real document processing tasks).
	- If a document image/scan is so poor quality that it would never be accepted by a bank, court, or in any other official capacity, are outside of the scope of this corpus. 
		- Examples include crumpled up receipts, extremely blurry/warped images from cell phones, etc. 
- Pictures of non-documents
	- License plates, T-shirts, street signs, etc.
	- Traditional OCR programs are not designed for these types of applications, and are not the best approach.

# Known Limitations
## Subjective Differences Counted as Errors
Some number of "errors" reported by the benchmark are actually minor or entirely subjective differences.  For example, what ASCII character gets used to represent a non-ASCII bullet point?  Is recognition run on words within embedded images (e.g. logos or graphs)? 

## Layout Analysis/Word Order is Unchecked
This benchmark compares OCR on the word level.  If the data being benchmarked has words in the exact same locations with the exact same content as the ground truth, it will be marked as accurate.  This check does not consider word order or page layout, which can be relevant when extract text from OCR data.  For example, it is possible for a 2-column layout to be incorrectly identified as a 1-column layout (therefore ordering words incorrectly), while still getting all individual words correct.  If we did add checks for layout/word order, the ground truth would need to be re-evaluated, as it has not yet been reviewed for this type of accuracy. 

Note that adding a benchmark that included layout would require a non-trivial amount of work past checking the ground truth data and adding a comparison.  This is because the *vast majority* of differences in how lines are ordered/segmented are not due to multiple columns being improperly combined, but rather due to subjective differences between programs.  For example, are table cells grouped by column or by row? Are floating elements with the same baseline (e.g. a page header and page number) combined into the same line or do they get different lines?  Etc.

# Contributing
If users encounter an image that is not represented in the corpus, they should feel free to add new images as a PR.  For those contributing, please follow these guidelines:

1. Confirm your contributions is within the scope of this corpus (see "Scope" section of readme)
2. Submit only `.png` or `.jpeg` files for images.
3. Submit images that are distinct from existing images.
	1. "Distinct" could mean a different scan quality, different font, different layout, or any other quality that impacts OCR accuracy.
4. Include only 1-2 images per relevant test case.
	1. Once a single page from a document is included, adding additional pages that are nearly identical (same font, quality, etc.) provides little additional value, but inflates the size of the benchmark.
5. **Highly Recommended:** Include accurate ground truth data.
	1. To significantly improve the odds you contribution is merged, contribute an accurate ground truth file alongside your image.
		1. A ground truth file is simply a `.hocr` file that contains no errors.  This can be generated by using [scribeocr.com](https://scribeocr.com/) to run OCR (or upload existing OCR), correcting all errors, and exporting as `.hocr`.
		2. All files require ground truth data to be included in the benchmark, so any image contributions without ground truth would require another use to create this data. 
