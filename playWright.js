// crawlee.js
import { PlaywrightCrawler, Dataset } from 'crawlee';
// Don't forget to import cheerio, we will need it later.
import cheerio from 'cheerio';

// Replace CheerioCrawler with PlaywrightCrawler
const crawler = new PlaywrightCrawler({
    requestHandler: async ({ page, request, enqueueLinks }) => {
        // Here, we extract the HTML from the browser and parse
        // it with Cheerio. Thanks to that we can use exactly
        // the same code as before, when using CheerioCrawler.
        const $ = cheerio.load(await page.content());

        if (request.userData.label === 'START') {
            await enqueueLinks({
                selector: 'a[href*="/product/"]',
                baseUrl: new URL(request.url).origin,
            });

            // When on the START page, we don't want to
            // extract any data after we extract the links.
            return;
        }

        // We copied and pasted the extraction code
        // from the previous lesson
        const title = $('h3').text().trim();
        const price = $('h3 + div').text().trim();
        const description = $('div[class*="Text_body"]').text().trim();

        // Because we're using a browser, we can now access
        // dynamically loaded data. Our target site has
        // dynamically loaded images.
        const imageRelative = $('img[alt="Product Image"]').attr('src');
        const base = new URL(request.url).origin;
        const image = new URL(imageRelative, base).href;

        // Instead of saving the data to a variable,
        // we immediately save everything to a file.
        await Dataset.pushData({
            title,
            description,
            price,
            image,
        });
    },
});

await crawler.addRequests([{
    url: 'https://demo-webstore.apify.org/search/on-sale',
    // By labeling the Request, we can very easily
    // identify it later in the requestHandler.
    userData: {
        label: 'START',
    },
}]);

await crawler.run();