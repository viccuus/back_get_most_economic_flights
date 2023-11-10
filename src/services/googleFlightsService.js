const puppeteer = require('puppeteer')
const { GOOGLE_FLIGHTS_URL } = require("../properties/config")


async function generalScrapGoogleFlights(placeFrom, placeTo, dateFrom, dateTo) {
    const {page, browser} = await setScrapingConditions()
    await closeConfirmationWindow(page)
    await writeFromTo(page, placeFrom, placeTo)
    await writeFlightDates(page, dateFrom, dateTo)
    await checkIfChangeDateOption(page)
    await orderByPrice(page)
    const flights = await getFinalFlights(page)
    console.debug("Flights:" + flights)
    await browser.close()
    return flights
}

async function setScrapingConditions() {
    const browser = await puppeteer.launch({
        headless: false 
        // change to "new"
    })

    const page = await browser.newPage()
    page.setViewport({
        width: 1600,
        height: 900
    })

    page.setDefaultNavigationTimeout(60000);
    await page.goto(GOOGLE_FLIGHTS_URL)
    return {page, browser}
}

async function closeConfirmationWindow(page) {
    await page.waitForXPath('//div[@class="lssxud"]//div//button[@aria-label="Aceptar todo"]')
    await new Promise(r => setTimeout(r, 500))
    const [confirmationWindow] = await page.$x('//div[@class="lssxud"]//div//button[@aria-label="Aceptar todo"]')
    await confirmationWindow.click()
}

async function writeFromTo(page, placeFrom, placeTo) {
    // check if the places are already loaded
    await page.waitForXPath('//*[@id="i21"]')

    // write "from"
    const [from] = await page.$x('//*[@id="i21"]/div[1]/div')
    await from.click()
    await new Promise(r => setTimeout(r, 500))
    await page.keyboard.type(placeFrom)
    await page.keyboard.press('Enter')

    // write "to"
    const [to] = await page.$x('//*[@id="i21"]/div[4]/div')
    await to.click()
    await page.keyboard.type(placeTo)
    await page.keyboard.press('Enter')
}

async function writeFlightDates(page, dateFrom, dateTo) {
    // check if the dates are already loaded
    const [fromSelect] = await page.$x('//input[@aria-label="Salida"]')
    await fromSelect.click()
     await new Promise(r => setTimeout(r, 1000))
    await page.keyboard.type(dateFrom)

    const toSelect = await page.$x('//input[@aria-label="Vuelta"]')
    await toSelect[1].click()
    await new Promise(r => setTimeout(r, 1000))
    await page.keyboard.type(dateTo)

    const [exitButton] = await page.$x('//*[@id="i21"]/div[1]/div')
    await exitButton.click()

    const [searchFlights] = await page.$x('//div[@class="xFFcie"]//button[@aria-label="Buscar"]')
    await searchFlights.click()
}

async function checkIfChangeDateOption(page) {
    const [changeDateOption] = await page.$x("//button[@class='I0Kcef']");

    if(changeDateOption) {
        await changeDateOption.click()
    }
}

async function orderByPrice(page) {
    await page.waitForXPath("//button[contains(span, 'Ordenar por:')]")
    const [orderBy] = await page.$x("//button[contains(span, 'Ordenar por:')]")
    await new Promise(r => setTimeout(r, 500))
    await orderBy.click()

    const [price] = await page.$x("//li//span[text()='Precio']")
    await new Promise(r => setTimeout(r, 500))
    await price.click()
}

async function getFinalFlights(page) {
    //get the flights
    await page.waitForXPath("//*[contains(@class, 'pIav2d')]")
    await new Promise(r => setTimeout(r, 1000))
    const flights = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll(".pIav2d"))
        const firstFiveElements = elements.slice(0, 5)

        const data = firstFiveElements.map(v => {
            const airline = v.querySelector(".Ir0Voe .sSHqwe > span:nth-child(1)").textContent.trim()
            const placeFrom = v.querySelectorAll(".Ak5kof .sSHqwe .eoY5cb")[0]?.textContent.trim()
            const placeTo = v.querySelectorAll(".Ak5kof .sSHqwe .eoY5cb")[1]?.textContent.trim()
            const flightDuration = v.querySelector(".gvkrdb")?.textContent.trim()
            const price = v.querySelector(".U3gSDe .YMlIz > span")?.textContent.trim()
            return {
                airline,
                placeFrom,
                placeTo,
                flightDuration,
                price
            }
        })
        return data
    })
    return flights
}

module.exports = {
    generalScrapGoogleFlights
}