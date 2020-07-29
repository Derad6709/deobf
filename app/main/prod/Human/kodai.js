const captchaSolver = require('../Utilities/2captcha');
const BrowserModule = require('../Utilities/browser');

module.exports.KodaiHuman = class KodaiHuman {
  constructor(taskID, raffleID, tCaptchaKey, webhook) {
    this.taskID = taskID;
    this.raffleID = raffleID;
    this.tCaptchaKey = tCaptchaKey;
    this.webhook = webhook;

    this.siteKey = '6LceuKAUAAAAANlszS-ySauzunmtpFRKPFPsReaB';
    this.browser = null;
  }

  async humanMode(email, proxy, twitter) {
    try {
      this.browser = new BrowserModule(
        `https://raffles.kodai.io/raffles/${this.raffleID}`,
        proxy
      );
      await this.browser.launchBrowser();
      await this.browser.page.waitForSelector('button[id="enter-raffle-btn"]', {
        visible: true
      });
      await this.browser.page.waitFor(500);
      await this.browser.page.click('button[id="enter-raffle-btn"]');
      await this.browser.page.waitForSelector('input[id="email"]', {
        visible: true
      });
      await this.browser.page.type('input[id="email"]', email);
      await this.browser.page.type('input[id="twitter"]', twitter || 'N/A');
      process.send({
        type: 'task-status',
        taskID: this.taskID,
        site: 'Kodai',
        proxy: proxy || 'localhost',
        email,
        status: 'Waiting on captcha'
      });
      const cfCaptchaRes = await captchaSolver.solveCaptcha(
        this.tCaptchaKey,
        this.siteKey,
        'https://raffles.kodai.io/'
      );
      let captchaToken;
      if (typeof cfCaptchaRes !== 'string' && cfCaptchaRes !== void 0) {
        captchaToken = cfCaptchaRes.answer;
      } else {
        process.send({
          type: 'task-error',
          taskID: this.taskID,
          site: 'Kodai',
          proxy: proxy || 'localhost',
          status: 'Captcha response error',
          captchaResponse: cfCaptchaRes,
          email
        });
        return false;
      }

      process.send({
        type: 'task-status',
        taskID: this.taskID,
        site: 'Kodai',
        proxy: proxy || 'localhost',
        captchaResponse: captchaToken,
        email,
        status: 'Captcha recieved'
      });

      await this.browser.page.evaluate(
        `document.getElementById("g-recaptcha-response").innerHTML="${captchaToken}";`
      );
      await this.browser.page.evaluate(
        `cToken => {
        document
          .querySelectorAll('iframe[title="recaptcha challenge"]')
          .forEach(item => {
            item.contentWindow.document.body
              .querySelectorAll('input[id="recaptcha-token"]')
              .forEach(i => {
                return (i.value = cToken);
              });
          });
      }`,
        captchaToken
      );
      await this.browser.page.click('button[id="submit-raffle-entry"]');
      await new Promise(resolve => {
        return setTimeout(resolve, 2000);
      });
      const resultElement = await this.browser.page.evaluate(
        `document.querySelector('div[class="successfully-entered-body body"]').getAttribute("style")`
      );
      const errorElement = await this.browser.page.$('p[id="form-error"]');
      const pageError = await (
        await errorElement.getProperty('innerText')
      ).jsonValue();
      this.browser.closeBrowser();
      this.browser = null;
      if (pageError !== '') {
        return await this.humanMode(email, proxy, twitter);
      }
      if (resultElement.includes('display: none;')) {
        process.send({
          type: 'task-error',
          taskID: this.taskID,
          site: 'Kodai',
          proxy: proxy || 'localhost',
          status: `Failed to enter ${email}`
        });
        return false;
      }
      process.send({
        type: 'task-status',
        taskID: this.taskID,
        site: 'Kodai',
        proxy: proxy || 'localhost',
        status: `Entered ${email}`
      });
      return true;
    } catch (err) {
      this.browser.closeBrowser();
      this.browser = null;
      process.send({
        type: 'task-error',
        taskID: this.taskID,
        site: 'Kodai',
        proxy: proxy || 'localhost',
        status: `Failed to enter ${email}`,
        error: err.toString()
      });
      return false;
    }
  }
};
