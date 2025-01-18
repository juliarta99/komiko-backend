const getSlugInLastUrl = (url) => {
    const slug = url.split('/').filter(Boolean).pop();
    return slug;
}

module.exports = { getSlugInLastUrl }