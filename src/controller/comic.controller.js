const { load } = require("cheerio");
const { fetchPage } = require('../utils/fetchPage');
const { responseService } = require('../utils/response');

module.exports.getComics = async (req, res) => {
    const baseUrl = `https://komikstation.co/manga`;
    const params = new URLSearchParams(req.query);
    const url = `${baseUrl}?${params.toString()}`;

    try{
        const html = await fetchPage(url);
        const $ = load(html);
        const results = [];

        $(".bs").each((i, element) => {
            const title = $(element).find(".tt").text().trim();
            const category = $(element).find("span.type").text().trim();
            const chapter = $(element).find(".epxs").text().trim();
            const rating = $(element).find(".numscore").text().trim();
            const imageSrc = $(element).find("img").attr("src");
            const link = $(element).find("a").attr("href");
            
            results.push({
                title,
                category,
                chapter,
                rating,
                imageSrc,
                link,
            });
        });

        const prevPage = $(".hpage a.l").attr("href");
        const nextPage = $(".hpage a.r").attr("href");
      
        const responseBody = responseService.success(
            `Get Data Comics Successfully!`,
            {
                results: results,
                prevPage: prevPage ? `https://komikstation.co/manga${prevPage}` : null,
                nextPage: nextPage ? `https://komikstation.co/manga${nextPage}` : null
            }
        )
        res.status(200).json(responseBody);
    } catch(err) {
        console.error("Error fetching data:", err.message);
        const responseBody = responseService.internalServerError("Failed to fetch data");
        res.status(500).json(responseBody);
    }
}