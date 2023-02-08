// crawler.js
import { gotScraping } from 'got-scraping';

import cheerio from 'cheerio';

const WEBSITE_URL = 'https://demo-webstore.apify.org/';

const response = await gotScraping('https://demo-webstore.apify.org/');

const html = response.body;

const $ = cheerio.load(html);

const productLinks = $('a[href*="/product/"]');

const productsToScrape = [];

for (const link of productLinks) {
    const relativeUrl = $(link).attr('href');
    const absoluteUrl = new URL(relativeUrl, WEBSITE_URL);

    // add each product link to our array
    productsToScrape.push(absoluteUrl.href);
}

for (const link of productsToScrape) {
    // Download HTML.

    try {
        const productResponse = await gotScraping(link);
    const productHTML = productResponse.body;

    // Load into Cheerio to test the HTML.
    // We use $$ to avoid confusion with $ variable above.
    const $$ = cheerio.load(productHTML);

    // Extract the product's title from the <h3> tag
    const productPageTitle = $$('h3').text();

    // Print the title to the terminal to see
    // whether we downloaded the correct HTML.
    console.log(productPageTitle);
        
    } catch (error) {
        console.error(error.message, link)
    }
    
}
