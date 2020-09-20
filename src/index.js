const express = require('express');
const AWS = require('aws-sdk');

const Logger = require('./Logger');

const app = express();

const PORT = process.env.WAIFU_API_PORT || 8080;
const SPACES_KEY = process.env.WAIFU_API_SPACES_KEY || '';
const SPACES_SECRET = process.env.WAIFU_API_SPACES_SECRET || '';

const logger = module.exports.logger = new Logger('WaifuAPI', 'd');

AWS.config.update({
    accessKeyId: SPACES_KEY,
    secretAccessKey: SPACES_SECRET,
});

const endpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new AWS.S3({ endpoint })
const space = 'waifu';

const getImages = () => new Promise(async (resolve, reject) => {
    const data = await s3.listObjectsV2({
        Bucket: space,
        Delimiter: '/',
    }).promise().catch(reject);

    resolve(data.Contents.map(content => `https://${space}.nyc3.digitaloceanspaces.com/${content.Key}`));
});

app.get('/single', async (req, res) => {
    const imgs = await getImages();

    for (let i = imgs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = imgs[i];
        imgs[i] = imgs[j];
        imgs[j] = temp;
    }

    res.status(200).json({
        url: imgs[Math.floor(Math.random() * imgs.length)],
    });
});

app.listen(PORT, () => {
    logger.i(`API listening on port ${PORT}.`);
});
