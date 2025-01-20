const { load } = require("cheerio");
const { fetchPage } = require('../utils/fetchPage');
const { responseService } = require('../utils/response');
const { getSlugInLastUrl } = require("../utils/getSlugInLastUrl");

module.exports.getComics = async (req, res) => {
    const baseUrl = `https://komikstation.co/manga`;
    const params = new URLSearchParams(req.query);
    const url = `${baseUrl}?${params.toString()}`;

    try{
        const html = await fetchPage(url);
        const $ = load(html);
        const results = $(".bs").map((i, element) => {
            const title = $(element).find(".tt").text().trim();
            const category = $(element).find("span.type").text().trim();
            const chapter = $(element).find(".epxs").text().trim();
            const rating = $(element).find(".numscore").text().trim();
            const imageSrc = $(element).find("img").attr("src");
            const slug = getSlugInLastUrl($(element).find("a").attr("href"));

            return {
                title,
                category,
                chapter,
                rating,
                imageSrc,
                slug,
            };
        }).get();

        const prevPage = $(".hpage a.l").attr("href");
        const nextPage = $(".hpage a.r").attr("href");
      
        const responseBody = responseService.success(
            `Get Data Comics Successfully!`,
            {
                results: results,
                prevPage: prevPage ? prevPage : null,
                nextPage: nextPage ? nextPage : null
            }
        )
        res.status(200).json(responseBody);
    } catch(err) {
        console.error("Error fetching data:", err.message);
        const responseBody = responseService.internalServerError("Failed to fetch data");
        res.status(500).json(responseBody);
    }
}

module.exports.getComicDetails = async (req, res) => {
    const { comicId } = req.params;
    const url = `https://komikstation.co/manga/${comicId}`;

    try{
        const html = await fetchPage(url);
        const $ = load(html);

        const title = $(".infox .entry-title").text().trim();
        const imageSrc = $(".thumb img").attr("src");
        const rating = $(".rating .num").text().trim();
        const followedBy = $(".bmc").text().trim();

        const synopsis = $(".entry-content.entry-content-single").text().trim();

        const status = $(".tsinfo .imptdt").eq(0).find("i").text().trim();
        const type = $(".tsinfo .imptdt").eq(1).find("a").text().trim();
        const released = $(".fmed").eq(0).find("span").text().trim();
        const author = $(".fmed").eq(1).find("span").text().trim();
        const artist = $(".fmed").eq(2).find("span").text().trim();
        const updatedOn = $(".fmed").eq(4).find("span time").text().trim();

        const genres = $(".mgen a").map((i, element) => {
            const genreName = $(element).text().trim();
            const genreSlug = getSlugInLastUrl($(element).attr("href"));
            return {
                genreName,
                genreSlug,
            };
        }).get();

        let firstChapterSlug, firstChapterTitle;
        const chapterElements = $("#chapterlist li");
        const lastIndex = chapterElements.length - 1;
        const chapters = $("#chapterlist li").map((i, element) => {
            const chapterNum = $(element).find(".chapternum").text().trim();
            const chapterSlug = getSlugInLastUrl($(element).find(".eph-num a").attr("href"));
            const chapterDate = $(element).find(".chapterdate").text().trim();
            const downloadLink = $(element).find(".dload").attr("href");
        
            if (i === lastIndex) {
                firstChapterSlug = chapterSlug;
                firstChapterTitle = chapterNum;
            }
        
            return {
                chapterNum,
                chapterSlug,
                chapterDate,
                downloadLink,
            };
        }).get();

        const latestChapterSlug = getSlugInLastUrl($(".lastend .inepcx")
                                .last()
                                .find("a")
                                .attr("href"));
        const latestChapterTitle = $(".lastend .inepcx")
                                .last()
                                .find(".epcurlast")
                                .text()
                                .trim();

        const details = {
            title,
            imageSrc,
            rating,
            followedBy,
            synopsis,
            firstChapter: {
                title: firstChapterTitle,
                slug: firstChapterSlug,
            },
            latestChapter: {
                title: latestChapterTitle,
                slug: latestChapterSlug,
            },
            status,
            type,
            released,
            author,
            artist,
            updatedOn,
            genres,
            chapters,
        };

        const responseBody = responseService.success(
            `Get Data Detail Comic ${title} Successfully!`,
            details
        )
        res.status(200).json(responseBody);
    } catch(err) {
        console.error("Error fetching data:", err.message);
        const responseBody = responseService.internalServerError("Failed to fetch data");
        res.status(500).json(responseBody);
    }
}

module.exports.getChapterById = async (req, res) => {
    const { chapterId } = req.params;
    const url = `https://komikstation.co/${chapterId}`;

    try {
        const html = await fetchPage(url);
        const $ = load(html);

        const title = $("h1.entry-title").text().trim();
        if (!title) {
            throw new Error("Judul tidak ditemukan.");
        }

        const scriptContent = $("script")
            .filter((i, el) => $(el).html().includes("ts_reader.run"))
            .html();

        if (!scriptContent) {
            throw new Error("Script ts_reader.run tidak ditemukan.");
        }

        const matchResult = scriptContent.match(/ts_reader\.run\((.*?)\);/);
        if (!matchResult) {
            throw new Error("Data ts_reader.run tidak ditemukan di halaman.");
        }

        const jsonString = matchResult[1];
        const jsonObject = JSON.parse(jsonString);
        const images = jsonObject.sources[0]?.images || [];

        const prevChapter = getSlugInLastUrl(jsonObject.prevUrl) || null;
        const nextChapter = getSlugInLastUrl(jsonObject.nextUrl) || null;

        // const chapters = $(".nvx #chapter option").map((i, element) => {
        //     const chapterTitle = $(element).text().trim();
        //     const chapterUrl = getSlugInLastUrl($(element).attr("value")) || null;

        //     return {
        //         title: chapterTitle,
        //         url: chapterUrl,
        //     };
        // }).get();
        const comicUrl = $(".headpost .allc").find("a").attr("href");
        const html2 = await fetchPage(comicUrl);
        const $$ = load(html2);

        let firstChapterSlug, firstChapterTitle;
        const chapterElements = $$("#chapterlist li");
        const lastIndex = chapterElements.length - 1;
        const chapters = $$("#chapterlist li").map((i, element) => {
            const chapterNum = $$(element).find(".chapternum").text().trim();
            const chapterSlug = getSlugInLastUrl($$(element).find(".eph-num a").attr("href"));
        
            if (i === lastIndex) {
                firstChapterSlug = chapterSlug;
                firstChapterTitle = chapterNum;
            }
        
            return {
                title: chapterNum,
                url: chapterSlug,
            };
        }).get();

        const responseBody = responseService.success(
            `Get Data Chapter ${title} Successfully!`,
            {
                title,
                images,
                prevChapter,
                nextChapter,
                chapters
            }
        );
        res.status(200).json(responseBody);
    } catch (err) {
        console.error("Error fetching data:", err.message);
        const responseBody = responseService.internalServerError("Failed to fetch data");
        res.status(500).json(responseBody);
    }
};