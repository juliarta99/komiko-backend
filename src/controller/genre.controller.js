const { load } = require("cheerio");
const { fetchPage } = require('../utils/fetchPage');
const { responseService } = require('../utils/response');

module.exports.all = async (req, res) => {
    try{
        let responseBody = responseService.error(
            'Something Went Wrong',
            'Invalid Parameter'
        )

        const url = "https://komikstation.co/manga/list-mode/";
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
            "All Genre",
            genres
        )
        res.status(200).json(responseBody);
    } catch(err) {
        console.error("Error fetching data:", err.message);
        const responseBody = responseService.internalServerError("Failed to fetch data");
        res.status(500).json(responseBody);
    }
}