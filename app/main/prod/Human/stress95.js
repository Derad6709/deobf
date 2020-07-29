const Promise = require('bluebird');
const utilities = require('../Utilities/utilities.js');
const BrowserModule = require('../Utilities/browser');

class Stress95Human {
  constructor(raffleID, profile, account, proxy) {
    this.raffleID = raffleID;
    this.proxy = proxy;

    this.account = account;
    this.profile = profile;
    this.email = '';
    this.proxy = proxy;

    this.browser = null;
  }

  async humanMode() {
    try {
      if (this.browser !== null) return false;
      this.browser = new BrowserModule(
        `https://stress95.typeform.com/to/${this.raffleID}`,
        this.proxy
      );
      let form;
      await this.browser.launchBrowser();
      await this.browser.page.waitForFunction(
        'document.getElementById("root").getAttribute("style") === "opacity: 1;"'
      );
      const scripts = await this.browser.page.$$('script');
      for (let i = 0; i < scripts.length; i += 1) {
        const text = JSON.stringify(
          await (await scripts[i].getProperty('innerText')).jsonValue()
        );
        let s = JSON.parse(text);
        if (text.includes('form: {')) {
          const index = s.indexOf('form: {');
          s = s.substring(index + 6, s.indexOf('messages: {'));
          s = s.trim();
          form = JSON.parse(s.substring(0, s.length - 1));
        }
      }
      const fieldLabels = [];
      for (let i = 0; i < form.fields.length; i += 1) {
        const type = form.fields[i].type.split('_');
        if (type.length > 1) {
          type[1] = type[1].charAt(0).toUpperCase() + type[1].slice(1);
        }
        fieldLabels.push(`${type.join('')}-${form.fields[i].ref}`);
      }
      await this.browser.page.click('button[data-qa="start-button"]');

      for (let i = 0; i < fieldLabels.length; i += 1) {
        let input;
        if (form.fields[i].title.includes('email')) {
          await this.browser.page.type(
            `input[id=${fieldLabels[i]}]`,
            `${this.account.email}\n`
          );
        } else if (form.fields[i].title.includes('first name')) {
          await this.browser.page.type(
            `input[id=${fieldLabels[i]}]`,
            `${this.account.firstName}\n`
          );
        } else if (form.fields[i].title.includes('surname')) {
          input = 'last name';
          await this.browser.page.type(
            `input[id=${fieldLabels[i]}]`,
            `${this.account.lastName}\n`
          );
        } else if (form.fields[i].title.includes('country')) {
          const countryIndex = utilities.getRandomInt(
            0,
            form.fields[i].properties.choices.length - 1
          );
          input = form.fields[i].properties.choices[countryIndex].label;

          const divs = await this.browser.page.$$('div');
          const attr = await this.browser.page.$$eval('div', el => {
            return el.map(x => {
              return x.getAttribute('class');
            });
          });
          for (let k = 0; k < divs.length; k += 1) {
            if (attr[k]) {
              if (attr[k].includes('dropdown__IconWrapper')) {
                divs[k].click();
              }
            }
          }
          await new Promise(resolve => {
            return setTimeout(resolve, 1500);
          });
          let [div] = await this.browser.page.$x(
            `//*[@id="choice-${countryIndex}"]/div/div[1]`
          );
          if (div === undefined) {
            [div] = await this.browser.page.$x(
              `//*[@id="choice-${countryIndex}"]/div/div[1]/div`
            );
          }
          let attempts = 0;
          while (div === undefined && attempts < 25) {
            await new Promise(resolve => {
              return setTimeout(resolve, 500);
            });
            [div] = await this.browser.page.$x(
              `//*[@id="choice-${countryIndex}"]/div/div[1]/div`
            );
            if (div === undefined) {
              [div] = await this.browser.page.$x(
                `//*[@id="choice-${countryIndex}"]/div/div[1]`
              );
            }
            attempts += 1;
          }
          await div.click();
          await new Promise(resolve => {
            return setTimeout(resolve, 1500);
          });
          await this.browser.page.waitForSelector(
            'button[data-qa="submit-button deep-purple-submit-button"]',
            { visible: true }
          );
          await this.browser.page.keyboard.down('Control');
          await this.browser.page.keyboard.press('Enter');
          await this.browser.page.keyboard.up('Control');
          await this.browser.page.waitFor(750);
          await this.browser.page.keyboard.press('Enter');
          // attempts = 0;
          // while (
          //   (await this.browser.page.url()) ===
          //     `https://stress95.typeform.com/to/${this.raffleID}` &&
          //   attempts < 25
          // ) {
          //   await new Promise(resolve => {
          //     return setTimeout(resolve, 500);
          //   });
          //   console.log('Key Press');
          //   await this.browser.page.keyboard.down('Control');
          //   await this.browser.page.keyboard.press('Enter');
          //   await this.browser.page.keyboard.up('Control');

          //   if (
          //     (await this.browser.page.url()) ===
          //     `https://stress95.typeform.com/to/${this.raffleID}`
          //   ) {
          //     await this.browser.page.keyboard.press('Enter');
          //   }
          //   attempts += 1;
          // }
          const finalURL = await this.browser.page.url();
          await this.browser.closeBrowser();
          this.browser = null;
          if (
            attempts >= 10 &&
            finalURL === `https://stress95.typeform.com/to/${this.raffleID}`
          ) {
            return false;
          }
          return true;
        }
      }
    } catch (err) {
      console.log(err);
      await this.browser.closeBrowser();
      this.browser = null;
      return false;
    }
  }
}

module.exports = Stress95Human;
