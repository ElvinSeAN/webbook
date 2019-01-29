let websiteCrawler = require('./websiteCrawler');
let listofbook = require('./book.json')


let newCrawler = websiteCrawler;

newCrawler.init(listofbook.first);