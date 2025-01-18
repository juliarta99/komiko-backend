const { load } = require("cheerio");
const { fetchPage } = require('../utils/fetchPage');
const { responseService } = require('../utils/response');
const { getSlugInLastUrl } = require("../utils/getSlugInLastUrl");

module.exports.getAll = async (req, res) => {
    const url = "https://komikstation.co/manga/list-mode/";
    try{
        const html = await fetchPage(url);
        const $ = load(html);

        const genres = [];

        $(".dropdown-menu.c4.genrez li").each((i, element) => {
            const genreLabel = $(element).find("label").text().trim();
            const genreValue = $(element).find("input").val();

            if (genreLabel && genreValue) {
                genres.push({ label: genreLabel, value: genreValue });
            }
        });

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
            "Get Data Genre Successfully!",
            {
                allSeries: allSeries,
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
            "Get Data Genre Successfully!",
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