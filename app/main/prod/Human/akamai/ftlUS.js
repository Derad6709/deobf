const utilities = require('../../Utilities/utilities.js');
const discordWebhook = require('../../Utilities/webhooks.js');
const BrowserModule = require('../../Utilities/browser');
const request = require('request-promise').defaults({
  timeout: 30000
});
const UserAgent = require('user-agents');
const Promise = require('bluebird');

async function accountTask(refLink, email, isCatchall, proxy) {
  try {
    const b = new BrowserModule(refLink, proxy);
    await b.launchBrowser();
    await b.page.waitFor('#input_text_firstName');
    await b.page.click('#input_text_firstName');
    const fname = utilities.faker.name.firstName();
    const lname = utilities.faker.name.lastName();
    const accEmail = isCatchall
      ? `${fname}${utilities.genRandomChar(5)}@${email}`
      : email;
    await b.page.keyboard.type(fname); // Random First Name
    await b.page.waitFor(100);
    await b.page.click('#input_text_lastName');
    await b.page.keyboard.type(lname); // Random Last Name
    await b.page.waitFor(100);
    const birthdayMonth = (Math.floor(Math.random() * 12) + 1).toString();
    await b.page.click('#input_tel_dateofbirthmonth');
    await b.page.keyboard.type(
      birthdayMonth < 10 ? `0${birthdayMonth}` : birthdayMonth
    ); // Random Birthday Month
    await b.page.waitFor(50);
    const birthdayDay = (Math.floor(Math.random() * 28) + 1).toString();
    await b.page.click('#input_tel_dateofbirthday');
    await b.page.keyboard.type(
      birthdayDay < 10 ? `0${birthdayDay}` : birthdayDay
    ); // Random Birthday Day
    await b.page.waitFor(50);
    await b.page.click('#input_tel_dateofbirthyear');
    await b.page.keyboard.type(
      (Math.floor(Math.random() * (2001 - 1980)) + 1980).toString()
    ); // Random Birthyear (1980-2001)
    await b.page.waitFor(70);
    await b.page.click('#input_text_postalCode');
    await b.page.keyboard.type(utilities.faker.address.zipCode());

    await b.page.waitFor(50);
    await b.page.click('#input_email_uid');
    await b.page.keyboard.type(accEmail); // Email
    await b.page.waitFor(75);
    await b.page.click('#input_password_password');
    await b.page.keyboard.type('Osiris123!'); // Pass
    await b.page.waitFor(50);
    await b.page.click('#input_tel_phoneNumber');
    await b.page.keyboard.type(utilities.faker.phone.phoneNumber()); // Random Phone Number

    await b.page.waitFor(70);
    await b.page.click('#AccountCreate > div.Buttons.col.col-full > button');

    const newAccount = false;
    try {
      await b.page.waitForNavigation({
        waitUntil: 'domcontentloaded',
        timeout: 5000
      });
      process.send({
        type: 'flx-account',
        account: {
          email: accEmail,
          password: 'Osiris123!',
          firstName: fname,
          lastName: lname
        }
      });
      await b.closeBrowser();
      return accEmail;
    } catch (err) {
      await b.closeBrowser();
      return false;
    }
    // const finalURL = await b.page.url();
    // if (
    //   /* finalURL === 'https://www.footlocker.com/account/create/almost-done' */ newAccount
    // ) {
    //   console.log('Account Created!');
    //   process.send({
    //     type: 'flx-account',
    //     account: {
    //       email: accEmail,
    //       password: 'Osiris123!',
    //       firstName: fname,
    //       lastName: lname
    //     }
    //   });
    //   return true;
    // }
    // return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function createAccountEmails(taskID, refLink, emails, proxies, webhook) {
  try {
    const currProxies = utilities.shuffleArray(proxies);
    let success = 0;
    const accountsCreated = [];
    const failedEmails = [];
    for (let i = 0; i < emails.length; i += 1) {
      const proxy = currProxies.shift();
      currProxies.push(proxy);
      const result = await accountTask(refLink, emails[i], false, proxy);
      if (result) {
        success += 1;
        accountsCreated.push(emails[i]);
      } else {
        failedEmails.push(emails[i]);
      }
    }
    process.send({
      type: 'task-finish',
      status: `Successfully created ${success} accounts`,
      taskID,
      accountsCreated
    });
  } catch (err) {
    process.send({
      type: 'task-fatal',
      status: 'Task error',
      error: err,
      taskID
    });
  }
}

async function createAccountCatchalls(
  taskID,
  refLink,
  catchalls,
  maxAmount,
  proxies,
  webhook
) {
  try {
    const currProxies = utilities.shuffleArray(proxies);
    const currCatchalls = catchalls;
    let success = 0;
    const accountsCreated = [];
    for (let i = 0; i < maxAmount; i += 1) {
      const proxy = currProxies.shift();
      const catchall = currCatchalls.shift();
      currCatchalls.push(catchall);
      currProxies.push(proxy);
      const result = await accountTask(refLink, catchall, true, proxy);
      if (result) {
        success += 1;
        accountsCreated.push(result);
      }
    }
    process.send({
      type: 'task-finish',
      status: `Successfully created ${success} accounts`,
      taskID,
      accountsCreated
    });
  } catch (err) {
    process.send({
      type: 'task-fatal',
      status: 'Task error',
      error: err,
      taskID
    });
  }
}

async function verifyAccount(link, proxy) {
  try {
    // const ua = new UserAgent({ deviceCategory: 'desktop' }).toString();
    // let activationToken;
    // const linkParts = link.split('?');
    // const queryParts = linkParts[1].split('&');
    // for (let i = 0; i < queryParts.length; i += 1) {
    //   const parsedQS = queryParts[i].split('=');
    //   if (parsedQS[0] === 'activationToken') {
    //     const index = 1;
    //     activationToken = parsedQS[index];
    //   }
    // }
    // if (activationToken) {
    //   console.log(decodeURIComponent(activationToken));
    //   const opts = {
    //     uri: `https://www.footlocker.com/api/v3/activation?timestamp=${Date.now()}`,
    //     method: 'post',
    //     headers: {
    //       // accept:
    //       //   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    //       // 'accept-encoding': 'gzip, deflate, br',
    //       // 'accept-language': 'en-US,en;q=0.9',
    //       // cookie: '',
    //       // dnt: 1,
    //       // 'sec-fetch-dest': 'document',
    //       // 'sec-fetch-mode': 'navigate',
    //       // 'sec-fetch-site': 'none',
    //       // 'upgrade-insecure-requests': 1,
    //       // 'user-agent': ua
    //       accept: 'application/json',
    //       'accept-encoding': 'gzip, deflate, br',
    //       'accept-language': 'en-US,en;q=0.9',
    //       'content-type': 'application/json',
    //       cookie:
    //         '_abck=521DDB58F109945FD20F078A468D3815~0~YAAQoCtdzOAcjL5wAQAAAiYLywNg8hQ11kPudAd+ClRvxAbUoADC2i3agzkpBUQr8dujTwwVM5rbS/JUCRWZno0mh7UKnYNP8MjWSxE8vKdoKx8UuOWr+iZyfEXMz0wK1S5BtC58gbmRpW66L7mbTtYvlLo1rRxS/LqcI5jf8imCmLrgyos9kohUkpvaM6sutLM/pBS/RsC+jd2HLrKNV2qUUpk2t5KTj5U7hctnZxGpY+I3cLfz9ZNazOipKsYOwp6Tvh0/ZInAJJjIIZoBDU+a1l4FW8XOUPgy9utHvu2hxuyJa0IgJT5iKsojK/WlM4w5+iKWB8jdUrk=~-1~-1~-1;',
    //       origin: 'https://www.footlocker.com',
    //       referer: link,
    //       dnt: 1,
    //       'sec-fetch-dest': 'empty',
    //       'sec-fetch-mode': 'cors',
    //       'sec-fetch-site': 'same-origin',
    //       'upgrade-insecure-requests': 1,
    //       'user-agent': ua
    //     },
    //     body: {
    //       activationToken: decodeURIComponent(activationToken)
    //     },
    //     json: true,
    //     proxy: '',
    //     followAllRedirects: true,
    //     gzip: true
    //   };
    //   if (proxy !== undefined) {
    //     const proxyParts = proxy.split(':');
    //     if (proxyParts[2] && proxyParts[3]) {
    //       opts.proxy = `http://${proxyParts[2]}:${proxyParts[3]}@${proxyParts[0]}:${proxyParts[1]}`;
    //     } else {
    //       opts.proxy = `http://${proxyParts[0]}:${proxyParts[1]}`;
    //     }
    //   } else {
    //     delete opts.proxy;
    //   }
    //   const res = await request(opts);
    //   console.log(res);
    // if (res.includes('Thank You For Entering')) return true;
    const browser = new BrowserModule(link, proxy);
    await browser.launchBrowser();
    await browser.page.waitForSelector('h1.Heading-main');
    const headerElement = await browser.page.$('h1.Heading-main');
    const success = await browser.page.evaluate(el => {
      return el.textContent;
    }, headerElement);
    console.log(success);
    if (success === 'Success!') return true;
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function verifyAccounts(links, proxies) {
  try {
    const currProxies = utilities.shuffleArray(proxies);
    const tasks = [];
    for (let i = 0; i < links.length; i += 1) {
      const proxy = currProxies.shift();
      currProxies.push(proxy);
      tasks.push({
        proxy,
        link: links[i]
      });
    }
    const results = await Promise.map(tasks, setup => {
      return verifyAccount(setup.link, setup.proxy).then(r => {
        return r;
      });
    });
    console.log(results);
    process.send({
      type: 'verify-finished'
    });
    return true;
  } catch (err) {
    console.log(err);
    process.send({
      type: 'verify-finished'
    });
    return false;
  }
}

process.on('message', async data => {
  try {
    switch (data.action) {
      case 'start-task':
        if (data.store === 'FLX Account') {
          console.log(data.store);
          if (data.emailType === 'standard') {
            createAccountEmails(
              data.taskID,
              data.raffleLink,
              data.emails,
              data.proxies,
              data.webhook
            );
          } else if (data.emailType === 'catchall') {
            createAccountCatchalls(
              data.taskID,
              data.raffleLink,
              data.emails,
              data.profile.maxEntries,
              data.proxies,
              data.webhook
            );
          }
        }
        break;

      case 'verify-accounts':
        console.log('Here');
        verifyAccounts(data.links, data.proxies);
        break;

      default:
        break;
    }
  } catch (err) {
    console.log(err);
    process.send({
      type: 'task-fatal',
      taskID: data.taskID,
      error: err,
      status: 'Stopped'
    });
  }
});
