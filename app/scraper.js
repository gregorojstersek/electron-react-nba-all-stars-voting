const puppeteer = require('puppeteer');

function getChromiumExecPath() {
  return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
}

const voteOnNba = async (name, email) => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: getChromiumExecPath()
  });
  const page = await browser.newPage();

  await page.goto('https://vote.nba.com/#/');
  await page.setViewport({ width: 1400, height: 800 });

  await page.click('.toggle-filters__button');
  await page.waitFor(1000);

  await page.click('.jump-letters > button:nth-child(4)');
  await page.waitFor(1000);

  await page.click('[data-type="nba:vote:click:lukadoncic"]');
  await page.click('[data-type="nba:vote:click:gorandragic"]');

  await page.waitFor(1000);
  await page.click('[data-type="nba:vote:click:reviewandsubmit"]');

  await page.waitForSelector('#optinGeneral');

  await page.waitFor(1000);
  const firstName = await page.$('#confirmation-form [name="firstname"]');
  await firstName.type(name);

  const emailInput = await page.$('#email');
  await emailInput.type(email);

  await page.select('#ucountry', 'SI');

  await page.click('#optinGeneral');

  await page.click('.tune-in-footer');
};

const voteOnGoogleForLuka = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.google.com/search?q=luka+doncic');
  await page.setViewport({ width: 1400, height: 800 });
};

const voteOnGoogleForGoran = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.google.com/search?q=goran+dragic');
  await page.setViewport({ width: 1400, height: 800 });
};

module.exports = {
  voteOnNba,
  voteOnGoogleForLuka,
  voteOnGoogleForGoran
};
