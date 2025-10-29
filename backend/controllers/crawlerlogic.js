const axios = require("axios")
const cheerio = require('cheerio');
const {URL} = require('url')
const Max_pages = process.env.MAX_PAGES || 50;

async function crawlWebsite(req,res) {
    console.log('Request body:', req.body);
    let visitedPages = new Set();
    let queue = [];
    let count = 0 ;

    try{
        const {url, maxPages} = req.body;
        //const max_pages = maxPages || process.env.MAX_PAGES || 50;
        const max_pages = parseInt(maxPages) || parseInt(process.env.MAX_PAGES) || 50;

    
        console.log('maxPages received:', maxPages);
        console.log('max_pages being used:', max_pages);

        if(!url){
            return res.status(400).json({error:'The link doesnt exist'})
        }
        
        try {
            // parse URL, ex .hostname -> example.com
            new URL(url);
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                return res.status(400).json({error: 'Only HTTP/HTTPS URLs allowed'});
            }
        } catch (err) {
            return res.status(400).json({error: 'Invalid URL format'});
        }
        
        queue.push(url)
        // link does exist
        try{
            while (count < max_pages && queue.length > 0){
                const dequeuedItem = queue.shift();
                if (!visitedPages.has(dequeuedItem)){
                    visitedPages.add(dequeuedItem)
                    count += 1;
                   
                    try {
                        const response = await axios.get(dequeuedItem, { timeout: 5000 });
                        const html = response.data;
                        
                        const $ = cheerio.load(html);

                        // Find the <a> tag.
                        $('a').each((index,element) =>{
                            const links = $(element).attr('href');
                            
                            if(links) {
                                // Convert relative links to absoulte 
                                const URLAbsoulte = new URL(links, dequeuedItem).href;

                                const absoulteLink = new URL(URLAbsoulte);
                                const basicURL = new URL(dequeuedItem);

                                if(absoulteLink.hostname === basicURL.hostname){
                                    if (!visitedPages.has(URLAbsoulte) && !queue.includes(URLAbsoulte)) {
                                        queue.push(URLAbsoulte);
                                    }
                                }
                            }
                        });
                    } catch (pageError) {
                        console.log(`Failed to crawl ${dequeuedItem}: ${pageError.message}`);
                    }
                }
            }
            return res.status(200).json({totalPages: count, urls: Array.from(visitedPages)})
        } catch(err){
            return res.status(400).json({error: 'Crawling failed: ' + err.message})
        }
    } catch (error){
        return res.status(500).json({error: 'Server error: ' + error.message})
    }  
}

module.exports = { crawlWebsite };