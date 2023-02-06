// crawler.js
import { gotScraping } from 'got-scraping';

import cheerio from 'cheerio';

// This time we open main page
const response = await gotScraping('https://www.jumia.co.ke/');

const html = response.body;

const $ = cheerio.load(html);

const links = $('a');

for (const link of links) {
    const url = $(link).attr('href');
    console.log(url);
}