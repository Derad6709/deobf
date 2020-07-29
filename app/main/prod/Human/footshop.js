const utilities = require('../Utilities/utilities.js');
const request = require('request-promise').defaults({
  timeout: 30000
});
const UserAgent = require('user-agents');
const BrowserModule = require('../Utilities/browser');

class FootshopHuman {
  constructor(taskID, raffleLink, profile, size, proxy, tCaptchaApiKey) {
    this.jar = request.jar();
    this.userAgent = new UserAgent({ deviceCategory: 'desktop' });
    this.taskID = taskID;
    this.size = size;
    this.raffleLink = raffleLink;
    this.raffleID = null;
    this.tCaptchaApiKey = tCaptchaApiKey;
    this.proxy = proxy;

    this.email = '';
    this.foundSizes = [];
    this.sizeID = '';
    this.checkoutPK = '';
    this.consentID = '';
    this.checkoutToken = '';

    this.profile = profile;

    this.browser = null;
  }

  setNewCatchall(catchall) {
    this.email = `${this.profile.shipping.firstName +
      this.profile.shipping.lastName.substring(0, 3) +
      utilities.genRandomChar(utilities.getRandomInt(2, 4))}@${catchall}`;
  }

  async humanMode() {
    try {
      this.browser = new BrowserModule(this.raffleLink, this.proxy);
      await this.browser.launchBrowser();
      try {
        await this.browser.page.waitForXPath(
          '//*[@id="page-wrap"]/main/div[2]/div[1]/div[2]/div/div/div/div[2]/div[2]/div',
          { visible: true }
        );
      } catch (err) {
        // throw new Error('Raffle not live!');
        process.send({
          type: 'task-fatal',
          step: 'final',
          status: `Raffle not live!`,
          taskID: this.taskID
        });
      }

      const [sizeButton] = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[1]/div[2]/div/div/div/div[2]/div[2]/div'
      );
      await sizeButton.click();
      const sizes = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[1]/div[2]/div/div/div/div[2]/div[2]/div/div[2]/div'
      );
      const parsedSizes = [];
      let wantedIndex = -1;

      for (let i = 0; i < sizes.length; i += 1) {
        if (i > 0) {
          let size = await (
            await sizes[i].getProperty('innerText')
          ).jsonValue();
          size = size.split('\n');
          parsedSizes.push(size);
          if (size[0] === this.size) {
            wantedIndex = i;
          }
        }
      }
      if (this.size.toLowerCase() === 'random') {
        wantedIndex = utilities.getRandomInt(1, sizes.length - 1);
      }
      if (wantedIndex === -1) {
        throw new Error('Size not found!');
      }
      await sizes[wantedIndex].click();
      let [submitButton] = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[1]/div[2]/div/div/div/div[2]/div[3]/a'
      );
      await submitButton.click();

      await this.browser.page.waitForSelector('input[name="email"]', {
        visible: true,
        timeout: 20000
      });
      await this.browser.page.type('input[name="email"]', this.email);
      await this.browser.page.type(
        'input[name="phone"]',
        utilities.genRandomNum(10)
      );
      [submitButton] = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/form/div[1]/div/div[2]/div/div[3]/button'
      );
      await submitButton.click();
      await this.browser.page.waitForSelector('input[name="firstName"]', {
        visible: true,
        timeout: 20000
      });
      await this.browser.page.type(
        'input[name="firstName"]',
        this.profile.shipping.firstName
      );
      await this.browser.page.type(
        'input[name="lastName"]',
        this.profile.shipping.lastName
      );

      const [daySelect] = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/form/div[1]/div[2]/div[2]/div/div[4]/div[1]/div[1]/button'
      );
      const [monthSelect] = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/form/div[1]/div[2]/div[2]/div/div[4]/div[1]/div[2]/button'
      );
      const [yearSelect] = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/form/div[1]/div[2]/div[2]/div/div[4]/div[1]/div[3]/button'
      );

      const daySelections = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/form/div[1]/div[2]/div[2]/div/div[4]/div[1]/div[1]/div/button'
      );

      const monthSelections = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/form/div[1]/div[2]/div[2]/div/div[4]/div[1]/div[2]/div/button'
      );

      const yearSelections = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/form/div[1]/div[2]/div[2]/div/div[4]/div[1]/div[3]/div/button'
      );
      await daySelect.click();
      await this.browser.page.evaluate(ds => {
        ds.click();
      }, daySelections[utilities.getRandomInt(0, 29)]);
      await monthSelect.click();
      await this.browser.page.evaluate(ds => {
        ds.click();
      }, monthSelections[utilities.getRandomInt(0, 11)]);
      await yearSelect.click();
      await this.browser.page.evaluate(ds => {
        ds.click();
      }, yearSelections[utilities.getRandomInt(0, 40) + 18]);
      [submitButton] = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/form/div[1]/div[2]/div[2]/div/div[5]/button'
      );
      await submitButton.click();

      await this.browser.page.waitForXPath(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/form/div[1]/div[3]/div[2]/div/div[1]/div/select',
        { visible: true, timeout: 20000 }
      );

      const countrySelections = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/form/div[1]/div[3]/div[2]/div/div[1]/div/select/option'
      );
      wantedIndex = -1;
      wantedIndex = countrySelections;
      const countryList = [
        '',
        'Afghanistan',
        'Åland Islands',
        'American Samoa',
        'Andorra',
        'Angola',
        'Anguilla',
        'Antigua and Barbuda',
        'Armenia',
        'Aruba',
        'Australia',
        'Austria',
        'Azerbaijan',
        'Bahamas',
        'Barbados',
        'Belarus',
        'Belgium',
        'Belize',
        'Benin',
        'Bhutan',
        'Bolivia',
        'Bonaire',
        'Bosnia and Herzegovina',
        'Botswana',
        'Bouvet Island',
        'Bulgaria',
        'Burkina Faso',
        'Burundi',
        'Cambodia',
        'Cameroon',
        'Canada',
        'Canary Islands',
        'Cape Verde',
        'Cayman Islands',
        'Central African Republic',
        'Chad',
        'Cocos (Keeling) Islands',
        'Comoros',
        'Congo, Dem. Republic',
        'Congo, Republic',
        'Cook Islands',
        'Croatia',
        'Cuba',
        'Curacao',
        'Cyprus',
        'Czech Republic',
        'Denmark',
        'Djibouti',
        'Dominica',
        'East Timor',
        'Egypt',
        'Eritrea',
        'Estonia',
        'Ethiopia',
        'Falkland Islands',
        'Fiji',
        'Finland',
        'France',
        'French Guiana',
        'Gabon',
        'Gambia',
        'Georgia',
        'Germany',
        'Ghana',
        'Gibraltar',
        'Greece',
        'Greenland',
        'Grenada',
        'Guam',
        'Guatemala',
        'Guernsey',
        'Guinea',
        'Guinea-Bissau',
        'Haiti',
        'Honduras',
        'HongKong',
        'Hungary',
        'Iceland',
        'Iran',
        'Iraq',
        'Ireland',
        'Israel',
        'Italy',
        'Ivory Coast',
        'Jamaica',
        'Japan',
        'Jordan',
        'Kenya',
        'Kiribati',
        'Kuwait',
        'Kyrgyzstan',
        'Laos',
        'Latvia',
        'Lesotho',
        'Liberia',
        'Libya',
        'Liechtenstein',
        'Lithuania',
        'Luxemburg',
        'Macau',
        'Madagascar',
        'Malawi',
        'Malaysia',
        'Maldives',
        'Mali',
        'Malta',
        'Marshall Islands',
        'Mauritania',
        'Mauritius',
        'Mayotte',
        'Micronesia',
        'Moldova',
        'Monaco',
        'Mongolia',
        'Montserrat',
        'Mozambique',
        'Namibia',
        'Nauru',
        'Nepal',
        'Netherlands',
        'New Caledonia',
        'Nicaragua',
        'Niger',
        'Nigeria',
        'Niue',
        'Northern Mariana Islands',
        'Norway',
        'Oman',
        'Pakistan',
        'Palau',
        'Panama',
        'Papua New Guinea',
        'Paraguay',
        'Poland',
        'Portugal',
        'Puerto Rico',
        'Qatar',
        'Romania',
        'Saint Barthelemy',
        'Saint Helena',
        'Saint Lucia',
        'Saint Vincent and the Grenadines',
        'São Tomé and Príncipe',
        'Serbia',
        'Singapore',
        'Sint Eustatius',
        'Slovakia',
        'Slovenia',
        'Solomon Islands',
        'South Sudan',
        'Spain',
        'Sudan',
        'Suriname',
        'Swaziland',
        'Sweden',
        'Switzerland',
        'Syria',
        'Tahiti',
        'Taiwan',
        'Tajikistan',
        'Tanzania',
        'Thailand',
        'Togo',
        'Tonga',
        'Trinidad and Tobago',
        'Turks and Caicos Islands',
        'Tuvalu',
        'Uganda',
        'Ukraine',
        'United Arab Emirates',
        'United Kingdom',
        'USA',
        'Vanuatu',
        'Vatican City State',
        'Virgin Islands (British)',
        'Virgin Islands (U.S.)',
        'Yemen',
        'Zambia'
      ];

      if (this.profile.shipping.country === 'United States') {
        wantedIndex = countryList.findIndex(i => {
          return i === 'USA';
        });
      } else {
        wantedIndex = countryList.findIndex(i => {
          return i === this.profile.shipping.country;
        });
      }

      if (wantedIndex === -1) {
        throw new Error('Country not found.');
      }
      // await countrySelect.click();
      const countryValue = await (
        await countrySelections[wantedIndex].getProperty('value')
      ).jsonValue();
      await this.browser.page.select('select[name="country"]', countryValue);
      // If United States => if USA
      // else check if country === selection
      console.log(countryValue);
      if (countryValue === 'US') {
        await this.browser.page.waitForXPath(
          '//*[@id="page-wrap"]/main/div[2]/div[2]/form/div[1]/div[3]/div[2]/div/div[2]/div/div/div/select',
          { visible: true, timeout: 20000 }
        );
        const stateSelections = await this.browser.page.$x(
          '//*[@id="page-wrap"]/main/div[2]/div[2]/form/div[1]/div[3]/div[2]/div/div[2]/div/div/div/select/option'
        );
        wantedIndex = -1;
        const stateList = [
          '',
          'Alabama',
          'Alaska',
          'Arizona',
          'Arkansas',
          'California',
          'Colorado',
          'Connecticut',
          'Delaware',
          'Florida',
          'Georgia',
          'Hawaii',
          'Idaho',
          'Illinois',
          'Indiana',
          'Iowa',
          'Kansas',
          'Kentucky',
          'Louisiana',
          'Maine',
          'Maryland',
          'Massachusetts',
          'Michigan',
          'Minnesota',
          'Mississippi',
          'Missouri',
          'Montana',
          'Nebraska',
          'Nevada',
          'New Hampshire',
          'New Jersey',
          'New Mexico',
          'New York',
          'North Carolina',
          'North Dakota',
          'Ohio',
          'Oklahoma',
          'Oregon',
          'Pennsylvania',
          'Rhode Island',
          'South Carolina',
          'South Dakota',
          'Tennessee',
          'Texas',
          'Utah',
          'Vermont',
          'Virginia',
          'Washington',
          'West Virginia',
          'Wisconsin',
          'Wyoming',
          'Puerto Rico',
          'US Virgin Islands',
          'District of Columbia'
        ];
        wantedIndex = stateList.findIndex(i => {
          return i === this.profile.shipping.province;
        });
        console.log(wantedIndex);
        if (wantedIndex === -1) {
          throw new Error('State not found');
        }
        const stateValue = await (
          await stateSelections[wantedIndex].getProperty('value')
        ).jsonValue();
        await this.browser.page.select('select[name="usState"]', stateValue);
      }

      let streetParts = this.profile.shipping.addressLine1.split(' ');
      let cutoff = -1;
      for (let i = 0; i < streetParts.length; i += 1) {
        if (!isNaN(parseInt(streetParts[i]))) {
          cutoff = i;
        }
      }
      if (cutoff === -1) {
        return false;
      }
      streetParts = streetParts.slice(cutoff + 1, streetParts.length);
      streetParts = streetParts.join(' ');

      let numParts = this.profile.shipping.addressLine1.split(' ');
      let cutoff2 = -1;
      for (let i = 0; i < numParts.length; i += 1) {
        if (!isNaN(parseInt(numParts[i]))) {
          cutoff2 = i;
        }
      }
      if (cutoff2 === -1) {
        return false;
      }
      numParts = numParts.slice(0, cutoff2 + 1);
      numParts = numParts.join(' ');
      if (cutoff2 == 0) {
        numParts = `${utilities.genRandomAlpha(4)} ${numParts}`;
      }
      const [streetField] = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/form/div[1]/div[3]/div[2]/div/div[5]/div/div/div[1]/input'
      );
      const [houseNumField] = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/form/div[1]/div[3]/div[2]/div/div[6]/div/input'
      );
      const [postalField] = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/form/div[1]/div[3]/div[2]/div/div[8]/div/input'
      );
      const [cityField] = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/form/div[1]/div[3]/div[2]/div/div[9]/div/input'
      );
      const [consentCheckbox] = await this.browser.page.$x(
        '//*[@id="consent::privacy-policy-101"]'
      );
      await streetField.type(
        `${streetParts} ${this.profile.shipping.addressLine2}`.trim()
      );
      await houseNumField.type(numParts);
      await postalField.type(this.profile.shipping.postalcode);
      await cityField.type(this.profile.shipping.province);
      await this.browser.page.evaluate(ds => {
        ds.click();
      }, consentCheckbox);

      [submitButton] = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/form/div[1]/div[3]/div[2]/div/div[11]/button'
      );
      await submitButton.click();
      // await this.browser.page.waitFor(5000);
      await this.browser.page.waitForSelector('div.card-number-frame iframe');
      await this.browser.page.waitFor(750);
      // console.log(this.browser.page.frames().length);

      const cardNumFrame = await this.browser.page.$(
        'div.card-number-frame iframe'
      );
      await cardNumFrame.click();
      await this.browser.page.keyboard.type(this.profile.card.cardNo);
      await this.browser.page.waitFor(500);
      const expiryFrame = await this.browser.page.$(
        'div.expiry-date-frame iframe'
      );
      const expiryInput = this.profile.card.cardExp.split('/').join('');
      await expiryFrame.click();
      await this.browser.page.keyboard.type(expiryInput);
      await this.browser.page.waitFor(500);
      const cvcFrame = await this.browser.page.$('div.cvv-frame iframe');
      await cvcFrame.click();
      await this.browser.page.keyboard.type(this.profile.card.cardCVV);
      await this.browser.page.waitFor(500);
      [submitButton] = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/div[3]/button[1]'
      );
      const isDisabled = await this.browser.page.evaluate(button => {
        return button.disabled;
      }, submitButton);
      if (isDisabled) {
        await this.browser.closeBrowser();
        this.browser = null;
        return false;
      }
      await submitButton.click();
      await this.browser.page.waitForXPath(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/div[3]/button[1]'
      );
      // Wait for button to load in
      await this.browser.page.waitFor(1500);
      const [submitBtn] = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/div[3]/button[1]'
      );
      await submitBtn.click();
      // await this.browser.page.waitForNavigation({
      //   waitUntil: 'networkidle0',
      //   timeout: 20000
      // });
      await this.browser.page.waitForXPath(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/div[3]/div/div[1]/h2'
      );
      const [heading] = await this.browser.page.$x(
        '//*[@id="page-wrap"]/main/div[2]/div[2]/div[3]/div/div[1]/h2'
      );
      const headingText = await this.browser.page.evaluate(h => {
        return h.innerText;
      }, heading);

      await this.browser.page.waitFor(500000);
      await this.browser.closeBrowser();
      this.browser = null;
      if (headingText === 'Thank you!') {
        return true;
      }
      return false;
    } catch (err) {
      await this.browser.closeBrowser();
      this.browser = null;
      return false;
    }
  }
}

module.exports = FootshopHuman;
