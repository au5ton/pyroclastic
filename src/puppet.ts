
import { info, error, success } from './prettyPrint'
import { Credentials } from './Credentials';
import puppeteer from 'puppeteer'

export default async function puppet(cred: Credentials, config: any): Promise<void> {
    const snooze = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    info('Opening browser')
    const browser = await puppeteer.launch(config.puppeteer)
    const page = await browser.newPage()

    info('Navigating to start page')
    await page.goto('https://google.com/')
    
    info('Closing browser')
    await browser.close()
}