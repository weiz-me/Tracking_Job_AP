const puppeteer = require('puppeteer');
const fs = require('fs');

/**
 * Save LinkedIn job posting as PDF and return only the job description text.
 * @param {string} website - The LinkedIn job post URL.
 * @param {string} localPath - File path to save the PDF.
 * @returns {Promise<string>} - Extracted job description text.
 */
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium-browser'
})

async function pdfs(website, localPath) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(website, { waitUntil: 'networkidle2' });

  if (website.includes('linkedin')) {
    try {
      await page.mouse.click(0, 0); // dismiss overlays

      // Click "Show more" to expand job description
      const showMoreSelector = 'button.show-more-less-html__button--more';
      const hasShowMore = await page.$(showMoreSelector);
      if (hasShowMore) {
        await page.click(showMoreSelector);
      }

    } catch (error) {
      console.error('Error expanding job description:', error);
    }
  }

  // Save as PDF
  await page.pdf({
    path: localPath,
    format: 'A4',
    printBackground: true,
  });

  // Extract job description only
  const fullText = await page.evaluate(() => {
    return document.body.innerText;
  });

  await browser.close();
  // console.log(`PDF saved to ${localPath}`);
  return fullText;
}
async function pdfs_content(content,localPath) {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const contents = `<pre>${content}</pre>`;
  await page.setContent(contents);

  await page.pdf({ path: localPath, format: 'A4' });

  await browser.close();

  console.log('PDF created from HTML content.');


}
module.exports = {pdfs,pdfs_content};
// // Example usage
// (async () => {

//   const website = 'https://careers.adobe.com/us/en/job/ADOBUSR148217EXTERNALENUS/2025-University-Graduate-Software-Engineer?utm_source=linkedin&utm_medium=phenom-feeds&source=LinkedIn';
//   const localPath = './user_1/temp.pdf';

//   const jobText = await pdfs(website, localPath);
//   console.log('Full text\n', jobText);
// })();
