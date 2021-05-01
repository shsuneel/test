const assert = require('assert');
const utils = require('./utils');

describe('Tags input with autocomplete', function() {
  let page, browser;

  it('Loads the page', async () => {
    const setupParameters = await utils.setUp();
    page = setupParameters.page;
    browser = setupParameters.browser;
  }).timeout(5000);
      
  it('On start h1 loads correctly', async () => {
    await utils.waitForLoad(page, 'h1');

    const h1Handle = await page.$('h1');
    const h1Text = await page.evaluate(h1 => h1.innerHTML, h1Handle);
    assert.equal(h1Text, 'User information');
  }).timeout(2000);

  it('#documentName input should be empty and progressBar width = 0%', async () => {
    await utils.waitForLoad(page, '#documentName');

    const inputText = await page.evaluate(() => document.querySelector('#documentName').innerText);
    assert.equal(inputText, ''); 

    // Check form-progress-bar
    await utils.checkFormProgressBarWidthInRange(page, 0.0, 0.10);
  }).timeout(2000);

  it('Update #documentName value and check progressBar width = 25%', async () => {
    await page.focus('#documentName');
    await page.keyboard.type('ab');

    // Check input value
    const inputHandle = await page.$('#documentName');
    const inputText = await page.evaluate(elem => elem.value, inputHandle);
    assert.equal(inputText, 'ab'); 

    // Check form-progress-bar
    await utils.checkFormProgressBarWidthInRange(page, 0.15, 0.35);
  }).timeout(2000);

  it('#email input should be empty', async () => {
    const inputHandle = await page.$('#email');
    const inputText = await page.evaluate(elem => elem.innerText, inputHandle);
    assert.equal(inputText, ''); 
  }).timeout(2000);

  it('Update #email value and check progressBar width = 50%', async () => {
    await page.focus('#email');
    await page.keyboard.type('example@gmail.com');

    // Check input value
    const inputHandle = await page.$('#email');
    const inputText = await page.evaluate(elem => elem.value, inputHandle);
    assert.equal(inputText, 'example@gmail.com'); 

    // Check form-progress-bar
    await utils.checkFormProgressBarWidthInRange(page, 0.4, 0.5);
  }).timeout(2000);

  it('Update #documentType value = PDF and check progressBar width = 75%', async () => {
    await page.waitForSelector('#documentType', { timeout: 10 });
    await page.select('select#documentType', 'PDF');

    // Check form-progress-bar
    await utils.checkFormProgressBarWidthInRange(page, 0.65, 0.85);
  }).timeout(2000);

  it('Update #category value = Application and check progressBar width = 100%', async () => {
    await page.waitForSelector('#category', { timeout: 10 });
    await page.select('select#category', 'Application');

    // Check form-progress-bar
    await utils.checkFormProgressBarWidthInRange(page, 0.90, 1.00);
  }).timeout(2000);

  it('Set maximum valid length of #documentName and check progressBar width = 100%', async () => {
    await page.waitForSelector('#documentName', { timeout: 10 });
    await page.focus('#documentName');
    await page.keyboard.type('cdefghijklmnopqrstuvwxyz!@#$&*');

    // Check input value
    const inputText = await page.evaluate(() => document.querySelector('#documentName').value);
    assert.equal(inputText, 'abcdefghijklmnopqrstuvwxyz!@#$&*');

    // Check form-progress-bar
    await utils.checkFormProgressBarWidthInRange(page, 0.90, 1.00);
  }).timeout(2000);

  it('Set some invalid or empty fields and check progressBar width = 25%', async () => {
    await page.focus('#documentName');
    await page.keyboard.type('Z'); // now length exceeds the maximal allowed value
    const inputText = await page.evaluate(() => document.querySelector('#documentName').value);
    assert.equal(inputText, 'abcdefghijklmnopqrstuvwxyz!@#$&*Z');

    await page.waitForSelector('#category', { timeout: 10 });
    await page.select('select#category', 'Audit');
    await page.waitForSelector('#documentType', { timeout: 10 });
    await page.select('select#documentType', '');

    await page.focus('#email');
    await page.keyboard.type('@@@');

    // Check form-progress-bar
    await utils.checkFormProgressBarWidthInRange(page, 0.15, 0.35);
  }).timeout(2000);

  it('Set some invalid values for fields and check progressBar width = 25%', async () => {
    await page.focus('#documentName');
    await page.keyboard.down('Backspace'); // now name is ok

    await page.waitForSelector('#category', { timeout: 10 });
    await page.select('select#category', '');

    await page.evaluate(() => document.querySelector('#email').value = '');
    await page.focus('#email');
    await page.keyboard.type('example@@example..com');

    // Check form-progress-bar
    await utils.checkFormProgressBarWidthInRange(page, 0.15, 0.35);
  }).timeout(2000);

  after(function() {
    browser.close();
  });
});
