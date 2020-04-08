
import { info, error, success } from './prettyPrint'
import { Credentials } from './Credentials';
import { intercept } from './interceptor'
import { prompt } from 'inquirer'
import puppeteer from 'puppeteer'

declare const BentoStore: any;

export default async function puppet(cred: Credentials, config: any): Promise<void> {
  const snooze = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  info('Opening browser')
  const browser = await puppeteer.launch(config.puppeteer)
  const page = await browser.newPage()

  info('Navigating to start page')
  await page.goto('https://newconnect.mheducation.com/flow/connect.html')

  await page.waitForSelector('iframe[src$="#/access/signin"')

  await page.setRequestInterception(true);
  page.on('requestfinished', intercept);

  let frames = await page.frames()
  // anticipating 2 frames, a parent and child
  // we want the child
  const frame_38 = frames
    // sort ascending by number of frames
    .sort((a, b) => a.childFrames().length - b.childFrames().length)
  // get first (anticipated to have 0 child frames)
  [0];

  // Enter "Username"
  await frame_38.waitFor('input[name=username]')
  await frame_38.focus('input[name=username')
  await page.keyboard.type(cred.USERNAME)

  // Enter "Password"
  info('password')
  await frame_38.waitFor('input[name=password]')
  await frame_38.focus('input[name=password')
  await page.keyboard.type(cred.PASSWORD)

  // Click "Submit"
  await frame_38.waitFor('button[type=submit]')
  await frame_38.click('button[type=submit]')

  // Wait for the courses page
  await page.waitForSelector(`iframe[title="Connect - To Do Assignments"]`)
  info('navigated')

  await prompt({
    type: 'confirm',
    name: 'assready',
    message: `Press Enter when you've opened an assignment.`
  })

  info('Identifying frame')
  frames = await page.frames()
  //const frame_42 = frames.sort((a, b) => a.childFrames().length - b.childFrames().length)[0];
  const frame_42 = await Promise.race([
    // Include a "timeout" Promise so that Promise.race() is certain to resolve eventually
    new Promise<null>((resolve, reject) => setTimeout(() => resolve(null), 3000)),
    // Check which frames have the elements we're looking for
    ...frames.map(e => e.waitForSelector('div.confidence-buttons-container', { timeout: 3000 }))
  ])

  info('Frame identified!')
  //console.log(frame_42)

  console.log(BentoStore)

  info('snoozing')
  await snooze(60000)

  info('Closing browser')
  await browser.close()
}