/* eslint-disable arrow-body-style */
const discordWebhook = require('../Utilities/webhooks.js');
const utilities = require('../Utilities/utilities.js');

class FootpatrolHuman {
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
    for (let i = 0; i < this.tasks.length; i += 1) {
      const task = this.tasks[i];
      let { type, selector, value, condRender, filter, valueType } = task;
      if (selector) {
        await this.page.waitForSelector(selector, {
          timeout: 30000
        });
      }
      await this.page.waitFor(1000);
      if (type === 'type') {
        if (condRender !== void 0) {
          if (condRender) await this.page.type(selector, value);
        } else await this.page.type(selector, value);
      } else if (type === 'click') {
        await this.page.click(selector);
      } else if (type === 'select') {
        if (filter) {
          const options = await this.page.evaluate(selector => {
            const elements = document.querySelectorAll(`${selector} option`);
            const filteredList = [...elements].filter(
              el =>
                el.hasAttribute('value') &&
                el.value !== '' &&
                el.value !== 'null'
            );
            const options = filteredList.map(el => {
              const text = el.innerText;
              const value = el.getAttribute('value');

              // Get size from innerText
              let size = '';
              for (let i = 0; i < text.length; i++) {
                if (!isNaN(parseInt(text[i])) || text[i] === '.')
                  size += text[i];
                else break;
              }
              return {
                size,
                value
              };
            });
            return options;
          }, selector);
          if (value !== 'random') {
            console.log(options);
            const valueOptions = options.filter(option => {
              if (valueType === 'string') return option.value === value;
              return option.size === this.size;
            });
            console.log(valueOptions);
            if (valueOptions.length >= 1) {
              if (valueOptions.length > 1) {
                value =
                  valueOptions[utilities.randomInt(0, valueOptions.length - 1)]
                    .value;
              } else value = valueOptions[0].value;
              console.log('Select value =', value);
              console.log(valueOptions);
            } else {
              if (selector === '#shoesize') {
                process.send({
                  type: 'task-fatal',
                  status: `Size not available!`,
                  taskID: this.taskID
                });
                return false;
              }
              if (selector === '#comp_country') {
                process.send({
                  type: 'task-fatal',
                  status: `Country not available!`,
                  taskID: this.taskID
                });
                return false;
              }
              if (selector === '#comp_address4' && condRender) {
                process.send({
                  type: 'task-fatal',
                  status: `County not available!`,
                  taskID: this.taskID
                });
                return false;
              }
            }
          } else
            value = options[utilities.randomInt(0, options.length - 1)].value;
          console.log(options);
        }
        if (!condRender && selector !== '#comp_address4') {
          console.log('Select', value);
          await this.page.select(selector, value);
        } else if (condRender) {
          console.log('Select', value);
          await this.page.select(selector, value);
        }
      } else if (type === 'next') {
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
              title: 'Footpatrol Captcha Needed!',
              image:
                'https://pbs.twimg.com/profile_images/1180728481/fp_400x400.jpg',
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
          await this.page.waitFor(60000 * 2);
        }
        await this.page.waitForSelector('div.responcetxt', {
          timeout: 60000
        });
        await this.page.waitFor(3000);
        if (i === this.tasks.length - 1) return true;
      }
    }
    return false;
  }
}

module.exports = FootpatrolHuman;
