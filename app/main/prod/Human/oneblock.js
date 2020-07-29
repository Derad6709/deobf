const discordWebhook = require('../Utilities/webhooks.js');
const utilities = require('../Utilities/utilities.js');

class OneBlockHuman {
  constructor(tasks, page, taskID, webhook, proxy, profile, email, size) {
    this.tasks = tasks;
    this.taskID = taskID;
    this.webhook = webhook;
    this.proxy = proxy;
    this.page = page;
    this.profile = profile;
    this.email = email;
    this.size = size;
  }

  async fill() {
    let dropdownElementNum = 0;
    for (let i = 0; i < this.tasks.length; i += 1) {
      const task = this.tasks[i];
      let { type, selector, value } = task;
      if (
        selector ===
          `div.exportSelectPopup div[data-value='${this.profile.country}']` ||
        selector ===
          `div.exportSelectPopup div[data-value='${this.profile.shippingZone}']` ||
        selector === `div.exportSelectPopup div[data-value='${this.size}']`
      ) {
        let dropDownType;
        if (
          selector ===
          `div.exportSelectPopup div[data-value='${this.profile.country}']`
        )
          dropDownType = 'country';
        else if (
          selector ===
          `div.exportSelectPopup div[data-value='${this.profile.shippingZone}']`
        )
          dropDownType = 'shippingZone';
        else if (
          selector === `div.exportSelectPopup div[data-value='${this.size}']`
        )
          dropDownType = 'shoeSize';
        // Parse for our countries
        const dropdownOptions = await this.page.evaluate(dropDownType => {
          const elements = document.querySelectorAll('div[role=option]');
          const options = [].map.call(elements, el => {
            return el.getAttribute('data-value');
          });
          const countries = [];
          const shippingZones = [];
          const shoeSizes = [];
          options.forEach((option, j) => {
            if (dropDownType === 'shippingZone') {
              if (j > 0 && j < 5 && option !== '') shippingZones.push(option);
            } else if (dropDownType === 'country') {
              if (j > 5 && option !== '') countries.push(option);
            } else if (dropDownType === 'shoeSize') {
              if (option !== '') shoeSizes.push(option);
            }
          });
          return {
            countries,
            shippingZones,
            shoeSizes
          };
        }, dropDownType);
        if (dropDownType === 'country') {
          const { countries } = dropdownOptions;
          selector = `div.exportSelectPopup div[data-value='${
            countries[utilities.getRandomInt(0, countries.length - 1)]
          }']`;
        } else if (dropDownType === 'shippingZone') {
          const { shippingZones } = dropdownOptions;
          selector = `div.exportSelectPopup div[data-value='${
            shippingZones[utilities.getRandomInt(0, shippingZones.length - 1)]
          }']`;
        } else if (dropDownType === 'shoeSize') {
          const { shoeSizes } = dropdownOptions;
          const checkForSize = shoeSizes.includes(this.size);
          const size = checkForSize
            ? this.size
            : shoeSizes[utilities.getRandomInt(0, shoeSizes.length - 1)];
          selector = `div.exportSelectPopup div[data-value='${size}']`;
        }
      }
      if (selector) {
        await this.page.waitForSelector(selector);
      }
      await this.page.waitFor(1000);
      if (type === 'type') await this.page.type(selector, value);
      else if (type === 'click') await this.page.click(selector);
      else if (type === 'select') await this.page.select(selector, value);
      else if (type === 'option') {
        await this.page.evaluate(option => {
          document
            .querySelectorAll('div.quantumWizMenuPaperselectOptionList')
            [option].click();
        }, dropdownElementNum);
        dropdownElementNum += 1;
      } else if (type === 'next') {
        dropdownElementNum = 0;
        await this.page.click(selector);
        const solveCaptcha = await this.page.evaluate(async () => {
          const e = document.querySelector(
            'iframe[title="recaptcha challenge"]'
          );
          if (e) {
            const s = await e.contentWindow.document.body.querySelector(
              'div[id="rc-imageselect"]'
            );
            return s;
          }
          return null;
        });
        if (solveCaptcha !== null && i === this.tasks.length - 1) {
          process.send({
            taskID: this.taskID,
            type: 'task-status',
            status: 'Captcha needs solving!'
          });

          if (this.webhook !== '') {
            const msgObject = {
              title: 'One Block Down Captcha Needed!',
              image:
                'https://pbs.twimg.com/profile_images/515814922102398977/UYvGoioW_400x400.jpeg',
              status: `Captcha needed!`,
              details: {
                Email: this.email,
                Proxy: this.proxy || 'localhost'
              }
            };
            await discordWebhook.sendWebhook(
              this.webhook,
              msgObject,
              this.proxy
            );
          }
        }
        await this.page.waitForNavigation({
          waitUntil: 'domcontentloaded',
          timeout: 60000 * 2
        });

        if (i === this.tasks.length - 1) return true;
      }
    }
    return false;
  }
}

module.exports = OneBlockHuman;
