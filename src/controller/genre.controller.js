const { load } = require("cheerio");
const { fetchPage } = require('../utils/fetchPage');
const { responseService } = require('../utils/response');
const { getSlugInLastUrl } = require("../utils/getSlugInLastUrl");

module.exports.getAll = async (req, res) => {
    const url = "https://komikstation.co/manga/list-mode/";
    try{
        const html = await fetchPage(url);
        const $ = load(html);

        const genres = $(".dropdown-menu.c4.genrez li").map((i, element) => {
            const genreLabel = $(element).find("label").text().trim();
            const genreValue = $(element).find("input").val();

            if (genreLabel && genreValue) {
                return { 
                    label: genreLabel, 
                    value: genreValue 
                };
            }
        }).get();

        responseBody = responseService.success(
            "Get Data All Genre Successfully!",
            genres
        )
        res.status(200).json(responseBody);
    } catch(err) {
        console.error("Error fetching data:", err.message);
        const responseBody = responseService.internalServerError("Failed to fetch data");
        res.status(500).json(responseBody);
    }
}

module.exports.getById = async (req, res) => {
    const { genreId } = req.params;
    const url = `https://komikstation.co/genres/${genreId}`;

    try {
        const html = await fetchPage(url);
        const $ = load(html);
        const results = $(".bs").map((i, element) => {
            const series = {};
            const bsx = $(element).find(".bsx");
        
            series.title = bsx.find("a").attr("title");
            series.category = bsx.find("span.type").text().trim();
            series.chapter = bsx.find(".epxs").text();
            series.imageSrc = bsx.find("img").attr("src");
            series.rating = bsx.find(".numscore").text();
            series.slug = getSlugInLastUrl(bsx.find("a").attr("href"));
        
            return series;
        }).get();
    
        const pagination = $(".pagination a.page-numbers").map((i, element) => {
            const pageUrl = getSlugInLastUrl($(element).attr("href"));
            const pageNumber = $(element).text();
            
            if(pageNumber != "Berikutnya »") {
                return{ 
                    pageUrl, 
                    pageNumber 
                };
            }
        }).get();
    
        const responseBody = responseService.success(
            "Get Data Genre Successfully!",
            {
                results: results,
                pagination: pagination
            }
        )
        res.status(200).json(responseBody);
    } catch (err) {
        console.error("Error fetching data:", err.message);
        const responseBody = responseService.internalServerError("Failed to fetch data");
        res.status(500).json(responseBody);
    }
}

module.exports.getByIdAndPage = async (req, res) => {
    const { genreId, page } = req.params;
    const url = `https://komikstation.co/genres/${genreId}/page/${page}`;

    try{
        const html = await fetchPage(url);
        const $ = load(html);
        const results = $(".bs").map((i, element) => {
            const series = {};
            const bsx = $(element).find(".bsx");
        
            series.title = bsx.find("a").attr("title");
            series.category = bsx.find("span.type").text().trim();
            series.chapter = bsx.find(".epxs").text();
            series.imageSrc = bsx.find("img").attr("src");
            series.rating = bsx.find(".numscore").text();
            series.slug = getSlugInLastUrl(bsx.find("a").attr("href"));
        
            return series;
        }).get();
    
        const pagination = $(".pagination a.page-numbers").map((i, element) => {
            const pageText = $(element).text().trim().toLowerCase();
        
            if (pageText !== "« sebelumnya" && pageText !== "berikutnya »") {
                let pageUrl;
                const pageNumber = $(element).text();
                if(pageNumber == "1") {
                    pageUrl = "1";
                } else {
                    pageUrl = getSlugInLastUrl($(element).attr("href"));
                }
                if(pageNumber != "Berikutnya »") {
                    return { 
                        pageUrl,
                        pageNumber 
                    };
                }
            }
        }).get();

        const responseBody = responseService.success(
            "Get Data Genre Successfully!",
            {
                results: results,
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