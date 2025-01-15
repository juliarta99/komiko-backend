const express = require('express');
require('dotenv').config();

const app = express();
const { PORT } = process.env;

app.get('/', (req, res) => {
    return res.send("halo");
})

module.exports = app.listen(PORT, () => {
    console.info(`running on port ${PORT}`);
});