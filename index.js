const cheerio = require('cheerio');
const request = require('request-promise');
const fs = require('fs-extra');
const writeStream = fs.createWriteStream('quotes.csv');

async function init() {
    const $ = await request({
        uri: 'http://quotes.toscrape.com/',
        transform: body => cheerio.load(body)
    })
    const websitetitle = $('title');
    console.log(websitetitle.html());

    const websiteHeading = $('h1');
    console.log(websiteHeading.text().trim());

    const quote = $('.quote').find('a');

    writeStream.write('Quote|Author|Tags\n');

    $('.quote').each((i, el) => {
        const text = $(el).find('span.text').text().replace(/(^\“|\”$)/g, "");
        const author = $(el).find('span small.author').text();
        const tags = [];
        $(el).find('.tags a.tag').each((i, el) => tags.push($(el).text()));
        writeStream.write(`${text}|${author}|${tags}\n`);        
    })
}

init();
