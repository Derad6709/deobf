/* eslint-disable arrow-body-style */
const discordWebhook = require('../Utilities/webhooks.js');
const utilities = require('../Utilities/utilities.js');

class JdSportsHuman {
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
    let region = '';
    for (let i = 0; i < this.tasks.length; i += 1) {
      const task = this.tasks[i];
      let { type, selector, value, filter, valueType } = task;
      if (selector && selector !== '#comp_dob') {
        await this.page.waitForSelector(selector, {
          timeout: 30000
        });
      }
      await this.page.waitFor(1000);
      if (type === 'type') {
        // console.log('Region = ', region);
        if (selector === '#comp_dob') {
          if (region === 'EU') {
            const element = await this.page.evaluate(selector => {
              const el = document.querySelector(selector);
              console.log(el);
              if (el) return true;
              return false;
            }, selector);
            console.log(element);
            if (element) await this.page.type(selector, value);
          }
        } else if (selector === '#comp_address2') {
          if (region === 'GB') {
            await this.page.type(selector, value);
          }
        } else await this.page.type(selector, value);
        /*  if (
          (selector === '#comp_dob' && region === 'EU') ||
          selector !== '#comp_dob'
        )
          await this.page.type(selector, value); */
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
                el.value !== ' ' &&
                el.value !== 'null'
            );
            const options = filteredList.map(el => {
              const text = el.innerText;
              const value = el.getAttribute('value');

              /* // Get size from innerText
              let size = '';
              for (let i = 0; i < text.length; i++) {
                if (!isNaN(parseInt(text[i])) || text[i] === '.')
                  size += text[i];
                else break;
              } */
              return {
                text,
                value
              };
            });
            return options;
          }, selector);
          if (value !== 'random') {
            let valueOptions;
            console.log(options);
            if (valueType === 'number') {
              const sizes = options.map(o => {
                let spacesNum = 0;
                const size = o.text
                  .split('')
                  .filter(
                    key =>
                      !isNaN(key) ||
                      key === ' ' ||
                      key === '/' ||
                      key === '.' ||
                      key === ','
                  )
                  .join('');
                for (let k = 0; k < size.length; k++) {
                  const key = size[k];
                  if (key === ' ') spacesNum += 1;
                  else if (key !== ' ') break;
                }
                return {
                  text: size.substring(spacesNum, size.length),
                  value: o.value
                };
              });
              valueOptions = sizes.filter(option => option.text === this.size);
              if (parseInt(valueOptions[0].text) > 30) region = 'EU';
              else region = 'GB';
              console.log('SIZES', sizes);
              console.log('REGION', region);
            } else {
              valueOptions = options.filter(option => {
                // console.log(option, value);
                return option.text === value;
              });
            }
            console.log(valueOptions);
            /* if (valueType === 'number') {
              // Check shoes size for region
              console.log('Check shoes size for region');
              console.log(
                'size bigger ? ',
                parseInt(valueOptions[0].text) > 30
              );
              if (parseInt(valueOptions[0].text) > 30) region = 'EU';
              else region = 'GB';
            } */

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
              if (selector === '#comp_address4') {
                process.send({
                  type: 'task-fatal',
                  status: `County not available!`,
                  taskID: this.taskID
                });
                return false;
              }
            }
          } else {
            const randomOption =
              options[utilities.randomInt(0, options.length - 1)];
            if (valueType === 'number') {
              if (!isNaN(randomOption.text)) region = 'GB';
              else region = 'EU';
            }
            value = randomOption.value;
          }
          console.log(options);
        }
        await this.page.select(selector, value);
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
              title: 'JD Sports Captcha Needed!',
              image:
                'https://pbs.twimg.com/profile_images/880822105528467456/nsMW_QMY_400x400.jpg',
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
        const checkSelector = region === 'GB' ? '#validation' : '.responcetxt';
        /* await this.page.waitFor(4000);
        const formCheck = await this.page.evaluate(checkSelector => {
          const check = document.querySelector(checkSelector);
          if (check !== null) return true;
          return false;
        }, checkSelector);
        if (i === this.tasks.length - 1) {
          if (region === 'GB' && !formCheck) return true;
          if (region !== 'GB' && formCheck) return true;
        } */
        if (region === 'GB') {
          try {
            await this.page.waitForSelector(checkSelector, { hidden: true });
          } catch (error) {
            console.log(error);
            return false;
          }
        } else if (region === 'EU') {
          try {
            await this.page.waitForSelector(checkSelector);
          } catch (error) {
            console.log(error);
            return false;
          }
        }
        await this.page.waitFor(3000);
        if (i === this.tasks.length - 1) return true;
      }
    }
    return false;
  }
}

module.exports = JdSportsHuman;
