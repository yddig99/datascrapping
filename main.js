// main.js
import { gotScraping } from 'got-scraping';

import cheerio from 'cheerio';

import { parse } from 'json2csv';

import { writeFileSync } from 'fs';

const response = await gotScraping('https://demo-webstore.apify.org/search/on-sale');

const html = response.body;

const $ = cheerio.load(html);

const products = $('a[href*="/product/"]');

const results = [];

for (const product of products) {
    const element = $(product);

    const title = element.find('h3').text();

    const price = element.find('div[class*="price"]').text();

    results.push({
        title,
        price,
    });
}

const csv = parse(results);

writeFileSync('products.csv', csv);