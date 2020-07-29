const utilities = require('../Utilities/utilities.js');
const BrowserModule = require('../Utilities/browser');

class NakedHuman {
  constructor(raffleID, profile, account, proxy) {
    this.raffleID = raffleID;
    this.proxy = proxy;
    this.profile = profile;
    this.firstName = account.firstName;
    this.lastName = account.lastName;
    this.email = account.email;

    this.browser = null;
  }

  async humanMode() {
    try {
      console.log(`https://nakedcph.typeform.com/to/${this.raffleID}`);
      this.browser = new BrowserModule(
        `https://nakedcph.typeform.com/to/${this.raffleID}`,
        this.proxy
      );
      await this.browser.launchBrowser();
      try {
        await this.browser.page.waitForFunction(
          'document.getElementById("root").getAttribute("style") === "opacity: 1;"'
        );
      } catch (e) {
        await this.browser.closeBrowser();
        this.browser = null;
        this.humanMode();
      }

      await this.browser.page.waitForSelector(
        'button[data-qa="start-button"]',
        {
          visible: true
        }
      );
      await this.browser.page.click('button[data-qa="start-button"]');
      let form;
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
      const formIDs = [];
      for (let i = 0; i < form.fields.length; i += 1) {
        const type = form.fields[i].type.split('_');
        if (type.length > 1) {
          type[1] = type[1].charAt(0).toUpperCase() + type[1].slice(1);
        }
        fieldLabels.push(`${type.join('')}-${form.fields[i].ref}`);
        formIDs.push(form.fields[i].ref);
      }
      // await this.browser.page.waitForFunction(
      //   `document.getElementById("block-${formIDs[0]}").getAttribute("data-qa-focused") === "true"`
      // );
      await this.browser.page.waitFor(500);
      await this.browser.page.keyboard.press('Enter');
      try {
        await this.browser.page.waitForFunction(
          `document.getElementById("block-${formIDs[1]}").getAttribute("data-qa-focused") === "true"`
        );
      } catch (e) {
        await this.browser.closeBrowser();
        this.browser = null;
        this.humanMode();
      }

      let [inputField] = await this.browser.page.$x(
        `//*[@id="email-${formIDs[1]}"]`
      );
      await inputField.type(this.email);
      await this.browser.page.keyboard.press('Enter');
      try {
        await this.browser.page.waitForFunction(
          `document.getElementById("block-${formIDs[2]}").getAttribute("data-qa-focused") === "true"`
        );
      } catch (e) {
        await this.browser.closeBrowser();
        this.browser = null;
        this.humanMode();
      }

      [inputField] = await this.browser.page.$x(
        `//*[@id="shortText-${formIDs[2]}"]`
      );
      await inputField.type(this.firstName);
      await this.browser.page.keyboard.press('Enter');
      try {
        await this.browser.page.waitForFunction(
          `document.getElementById("block-${formIDs[3]}").getAttribute("data-qa-focused") === "true"`
        );
      } catch (e) {
        await this.browser.closeBrowser();
        this.browser = null;
        this.humanMode();
      }

      [inputField] = await this.browser.page.$x(
        `//*[@id="shortText-${formIDs[3]}"]`
      );
      await inputField.type(this.lastName);
      await this.browser.page.keyboard.press('Enter');
      try {
        await this.browser.page.waitForFunction(
          `document.getElementById("block-${formIDs[4]}").getAttribute("data-qa-focused") === "true"`
        );
      } catch (e) {
        await this.browser.closeBrowser();
        this.browser = null;
        this.humanMode();
      }

      let [dropdown] = await this.browser.page.$x(
        `//*[@id="block-scroller-${formIDs[4]}"]/div/div/div/div[2]/div[1]/div/div[2]/div[2]`
      );
      await dropdown.click();
      await this.browser.page.waitFor(1000);
      await this.browser.page.type(
        'input[data-qa="country-dropdown-select-search-input"]',
        'United Kingdom'
      );
      await this.browser.page.click(
        'div[data-qa="country-dropdown-select-option"]'
      );

      // const [countrySelect] = await this.browser.page.$x(
      //   `//*[@id="block-scroller-${formIDs[4]}"]/div/div/div/div[2]/div[1]/div/div[1]/div/div/div/div[2]/div[1]/div/div[1]/div/div/div/div/div[2]/div[1]`
      // );
      // const countrySelectText = await (
      //   await countrySelect.getProperty('innerText')
      // ).jsonValue();
      // if (countrySelectText !== this.profile.shipping.country) {
      //   return false;
      // }
      [inputField] = await this.browser.page.$x(
        `//*[@id="phone-number-${formIDs[4]}"]`
      );
      // let placeholder = await this.browser.page.evaluate(id => {
      //   return document
      //     .getElementById(`phone-number-${id}`)
      //     .getAttribute('placeholder');
      // }, formIDs[4]);
      // placeholder = placeholder.replace(/\D/g, '');
      // const replacementIndex = placeholder.indexOf('1234');
      // const digitsReplaced = placeholder.length - replacementIndex;
      // let phone =
      //   placeholder.slice(0, replacementIndex) +
      //   utilities.genRandomNum(digitsReplaced);
      // if (this.profile.shipping.country === 'United States') {
      //   const areaCodes = [
      //     '917',
      //     '646',
      //     '212',
      //     '332',
      //     '205',
      //     '251',
      //     '406',
      //     '907',
      //     '480',
      //     '702',
      //     '201',
      //     '505',
      //     '303',
      //     '808',
      //     '405',
      //     '503',
      //     '208',
      //     '718',
      //     '423',
      //     '225',
      //     '210',
      //     '682',
      //     '225',
      //     '435'
      //   ];
      //   phone =
      //     areaCodes[utilities.getRandomInt(0, areaCodes.length - 1)] +
      //     utilities.getRandomInt(2, 9) +
      //     utilities.getRandomInt(2, 9) +
      //     utilities.getRandomInt(2, 9) +
      //     utilities.genRandomNum(4);
      // }
      const phone = `07400${utilities.genRandomNum(6)}`;
      await inputField.type(phone);
      await this.browser.page.keyboard.press('Enter');
      try {
        await this.browser.page.waitForFunction(
          `document.getElementById("block-${formIDs[5]}").getAttribute("data-qa-focused") === "true"`
        );
      } catch (e) {
        await this.browser.closeBrowser();
        this.browser = null;
        this.humanMode();
      }

      [inputField] = await this.browser.page.$x(
        `//*[@id="shortText-${formIDs[5]}"]`
      );
      const address = utilities.getRandomAddress();
      await inputField.type(
        address.addressLine2
          ? `${address.addressLine1}, ${address.addressLine2}`
          : address.addressLine1
      );
      await this.browser.page.keyboard.press('Enter');
      try {
        await this.browser.page.waitForFunction(
          `document.getElementById("block-${formIDs[6]}").getAttribute("data-qa-focused") === "true"`
        );
      } catch (e) {
        await this.browser.closeBrowser();
        this.browser = null;
        this.humanMode();
      }

      [inputField] = await this.browser.page.$x(
        `//*[@id="shortText-${formIDs[6]}"]`
      );
      await inputField.type(this.profile.shipping.postalcode);
      await this.browser.page.keyboard.press('Enter');
      try {
        await this.browser.page.waitForFunction(
          `document.getElementById("block-${formIDs[7]}").getAttribute("data-qa-focused") === "true"`
        );
      } catch (e) {
        await this.browser.closeBrowser();
        this.browser = null;
        this.humanMode();
      }

      [inputField] = await this.browser.page.$x(
        `//*[@id="shortText-${formIDs[7]}"]`
      );
      await inputField.type(this.profile.shipping.city);
      await this.browser.page.keyboard.press('Enter');
      try {
        await this.browser.page.waitForFunction(
          `document.getElementById("block-${formIDs[8]}").getAttribute("data-qa-focused") === "true"`
        );
      } catch (e) {
        await this.browser.closeBrowser();
        this.browser = null;
        this.humanMode();
      }

      [inputField] = await this.browser.page.$x(
        `//*[@id="block-scroller-${formIDs[8]}"]/div/div/div/div[2]/div[1]/div/div[1]/input`
      );
      await inputField.click();
      await inputField.type(this.profile.shipping.country);
      await this.browser.page.keyboard.press(`Enter`);

      // const wantedIndex = form.fields[8].properties.choices.findIndex(i => {
      //   return i.label === this.profile.shipping.country;
      // });

      // if (wantedIndex === -1) {
      //   console.log('NIEN');
      //   return false;
      // }
      try {
        await this.browser.page.waitForFunction(
          `document.getElementById("block-${formIDs[9]}").getAttribute("data-qa-focused") === "true"`
        );
      } catch (e) {
        await this.browser.closeBrowser();
        this.browser = null;
        this.humanMode();
      }
      [dropdown] = await this.browser.page.$x(
        `//*[@id="block-scroller-${formIDs[9]}"]/div/div/div/div[2]/div[1]/div/div[1]/div`
      );
      await dropdown.click();

      await this.browser.page.keyboard.press('ArrowDown');
      await this.browser.page.keyboard.press('Enter');
      await this.browser.page.waitFor(750);
      await this.browser.page.keyboard.down('Control');
      await this.browser.page.keyboard.press('Enter');
      await this.browser.page.keyboard.up('Control');
      await this.browser.page.waitFor(750);
      await this.browser.page.keyboard.press('Enter');
      await this.browser.page.waitFor(750);
      await this.browser.page.keyboard.press('Enter');
      // await this.browser.page.click(`div[id="choice-1"]`);
      await this.browser.page.waitFor(1000);
      const finalURL = await this.browser.page.url();
      await this.browser.page.waitFor(1000);
      await this.browser.closeBrowser();
      this.browser = null;
      console.log(finalURL);
      if (finalURL === `https://nakedcph.typeform.com/to/${this.raffleID}`) {
        return false;
      }
      return true;
    } catch (err) {
      console.log(err);
      await this.browser.closeBrowser();
      this.browser = null;
      return false;
    }
  }
}

module.exports = NakedHuman;
