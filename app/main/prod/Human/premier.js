const captchaSolver = require('../Utilities/2captcha.js');
const utilities = require('../Utilities/utilities.js');
const discordWebhook = require('../Utilities/webhooks.js');
const BrowserModule = require('../Utilities/browser');

async function enterRafflesBrowser(
  taskID,
  raffleLink,
  size,
  accounts,
  proxies
) {
  try {
    const currProxies = Object.assign([], proxies);
    let b;
    let success = 0;
    for (let i = 0; i < accounts.length; i += 1) {
      const proxy = currProxies.shift();
      currProxies.push(proxy);
      b = new BrowserModule('https://thepremierstore.com/account');
      await b.launchBrowser();
      await b.page.type('input#CustomerEmail', accounts[i].email);
      await b.page.type('input#CustomerPassword', `${accounts[i].password}\n`);

      if (b.page.url() === 'https://thepremierstore.com/account') {
        await b.page.goto(raffleLink);
        // await b.page.waitForNavigation({
        //   waitUntil: 'domcontentloaded',
        //   timeout: 20000
        // });
        try {
          await b.page.waitForSelector('img[alt="Close form"]');
          await b.page.click('img[alt="Close form"]');
        } catch (err) {
          console.log(err);
        }
        let h1 = await b.page.$('h1');
        if (h1) {
          h1 = await h1.getProperty('innerText');
          h1 = await h1.jsonValue();
          if (h1 === 'Page Not Found') {
            throw new Error('Raffle not found!');
          }
        }

        await b.page.click('div[class="location-item"]');

        const sizes = await b.page.$$('div[class="size-item"]');
        const mySize = size;
        let foundSize = false;
        if (mySize === 'random') {
          await sizes[utilities.getRandomInt(0, sizes.length - 1)].click();
          foundSize = true;
        } else {
          for (let j = 0; j < sizes.length; j += 1) {
            const thisSize = await (
              await sizes[j].getProperty('innerText')
            ).jsonValue();
            if (thisSize === mySize) {
              await sizes[i].click();
              foundSize = true;
            }
          }
        }

        console.log({ mySize, foundSize });
        if (foundSize) {
          const zipCode = utilities.faker.address.zipCode();
          await b.page.type('input[id="zip"]', zipCode);
          await b.page.click('input[type="checkbox"]');
          await b.page.click('div[class="drawing-enter-btn"]');
          await b.page.waitFor(30000);
          success += 1;
        }
      }
      await b.closeBrowser();
    }
    process.send({
      type: 'task-finish',
      status: `Successfully entered ${success} accounts`,
      taskID
    });
  } catch (err) {
    console.log(err);
    if (err.toString().includes('Raffle not found!')) {
      process.send({
        type: 'task-fatal',
        status: 'Raffle not found!',
        taskID
      });
    } else {
      process.send({
        type: 'task-fatal',
        status: `Task error`,
        taskID
      });
    }
  }
}

module.exports = enterRafflesBrowser;
