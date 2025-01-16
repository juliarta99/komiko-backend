const express = require('express');
const cors = require('cors');
require('dotenv').config();
const router = require('./src/routes/router');

const app = express();
const { CORS_ALLOWED_ORIGIN, PORT } = process.env;

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

app.use(
    cors({
        origin: CORS_ALLOWED_ORIGIN.split(','),
        credentials: true
    })
)

app.use('/api/v1', router)

app.use((req, res) => {
    res.status(404)
    res.send({
        success: true,
        message: 'Not Found'
    })
})

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || 'Internal Server Error'
    res.status(err.statusCode).json({
        message: err.message
    })
})

module.exports = app.listen(PORT, () => {
    console.info(`running on port ${PORT}`);
});