const { load } = require("cheerio");
const { fetchPage } = require('../utils/fetchPage');
const { responseService } = require('../utils/response');
const { getSlugInLastUrl } = require("../utils/getSlugInLastUrl");

module.exports.getBySearch = async (req, res) => {
    const { search } = req.params;
    const url = `https://komikstation.co/?s=${search}`;

    try{
        const html =  await fetchPage(url);
        const $ = load(html);
        const allSeries = [];

        $(".bs").each((i, element) => {
            const series = {};
            const bsx = $(element).find(".bsx");
        
            series.title = bsx.find("a").attr("title");
            series.slug = getSlugInLastUrl(bsx.find("a").attr("href"));
            series.image = bsx.find("img").attr("src");
            series.latestChapter = bsx.find(".epxs").text();
            series.rating = bsx.find(".numscore").text();
        
            allSeries.push(series);
        });
    
        const pagination = [];
            $(".pagination a.page-numbers").each((i, element) => {
            const pageUrl = getSlugInLastUrl($(element).attr("href"));
            const pageNumber = $(element).text();
            pagination.push({ pageUrl, pageNumber });
        });

        const responseBody = responseService.success(
            `Get Data Genre by ${search} Successfully!`,
            {
                allSeries: allSeries,
                pagination: pagination
            }
        )
        res.status(200).json(responseBody);
    } catch(err) {
        console.error("Error fetching data:", err.message);
        const responseBody = responseService.internalServerError("Failed to fetch data");
        res.status(500).json(responseBody);
    }
}

module.exports.getBySearchAndPage = async (req, res) => {
    const { search, page } = req.params;
    const url = `https://komikstation.co/page/${page}/?s=${search}`;

    try{
        const html =  await fetchPage(url);
        const $ = load(html);
        const allSeries = [];

        $(".bs").each((i, element) => {
            const series = {};
            const bsx = $(element).find(".bsx");
        
            series.title = bsx.find("a").attr("title");
            series.slug = getSlugInLastUrl(bsx.find("a").attr("href"));
            series.image = bsx.find("img").attr("src");
            series.latestChapter = bsx.find(".epxs").text();
            series.rating = bsx.find(".numscore").text();
        
            allSeries.push(series);
        });
    
        const pagination = [];
        $(".pagination a.page-numbers").each((i, element) => {
            const pageText = $(element).text().trim().toLowerCase();
        
            if (pageText !== "« sebelumnya" && pageText !== "berikutnya »") {
                const pageUrl = getSlugInLastUrl($(element).attr("href"));
                const pageNumber = $(element).text();
                pagination.push({ pageUrl, pageNumber });
            }
        });

        const responseBody = responseService.success(
            `Get Data Genre by ${search} Successfully!`,
            {
                allSeries: allSeries,
                pagination: pagination
            }
        )
        res.status(200).json(responseBody);
    } catch(err) {
        console.error("Error fetching data:", err.message);
        const responseBody = responseService.internalServerError("Failed to fetch data");
        res.status(500).json(responseBody);
    }
}