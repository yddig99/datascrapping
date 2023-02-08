import { gotScraping } from 'got-scraping';
import cheerio from 'cheerio';

const BASE_URL = 'https://demo-webstore.apify.org';

const startURL = `${BASE_URL}/search/on-sale`;

console.log(`Going to ${startURL}`);
const response = await gotScraping(startURL);
const $ = cheerio.load(response.body);

const productLinks = [];

for (const product of $('a[href*="product"]')) {
    const relative = $(product).attr('href');
    const url = new URL(relative, BASE_URL);
    productLinks.push(url);
}

console.log(`Collected ${productLinks.length} product URLs`);

const results = [];

const errors = [];

for (const url of productLinks) {
    try {
        console.log(`Scraping ${url}`);
        const productResponse = await gotScraping(url);
        const $$ = cheerio.load(productResponse.body);

        const title = $$('h3').text().trim();
        const price = $$('h3 + div').text().trim();
        const description = $$('div[class*="Text_body"]').text().trim();

        results.push({
            title,
            description,
            price,
        });
    } catch (error) {
        console.error(`Failed on ${url}: ${error.message}`);
        errors.push({
            url,
            err: error.message,
        });
    }
}

console.log(`${results.length} results:`);
console.log(results);