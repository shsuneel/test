const puppeteer = require('puppeteer');
const assert = require('assert');


async function setUp() {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/index.html', { waitUntil: 'load' });
  return {page, browser};
}

async function waitForLoad(page, cssSelector) {
  await page.waitForSelector(cssSelector, { timeout: 1500 });
}

async function _formProgressBarWidthInRange(minBound, maxBound) {
  const progressWidth = document.querySelector('.form-progress-bar-wrapper').getBoundingClientRect().width;
  const formWidth = document.querySelector('.form-progress-bar').getBoundingClientRect().width;
  const p = 1. * formWidth / progressWidth;
  return minBound <= p && p <= maxBound;
}

async function checkFormProgressBarWidthInRange(page, minBound, maxBound) {
  await page.waitForSelector('.form-progress-bar-wrapper', { timeout: 10 });
  await page.waitForSelector('.form-progress-bar', { timeout: 10 });
  try {
    await page.waitForFunction(
      _formProgressBarWidthInRange,
      { timeout: 200 },
      minBound, maxBound
    ); 
  } catch(error) {
    const p = await page.evaluate(() => {
      console.log(page.document.querySelector('.form-progress-bar-wrapper'))
      const progressWidth = document.querySelector('.form-progress-bar-wrapper').getBoundingClientRect().width;
      const formWidth = document.querySelector('.form-progress-bar').getBoundingClientRect().width;
      return 1. * formWidth / progressWidth;
    });
    assert.fail(`.form-progress-bar width is ${p * 100}% of .form-progress-bar-wrapper, ` +
                `but expected to be in range [${minBound * 100}%, ${maxBound * 100}%]`);
  }
}

module.exports = {
  setUp,
  waitForLoad,
  checkFormProgressBarWidthInRange
};
