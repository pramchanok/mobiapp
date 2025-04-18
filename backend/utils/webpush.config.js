require('dotenv').config();

const webpush = require('web-push');

webpush.setVapidDetails(
    'mailto:pramchanok@gmail.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

module.exports = webpush;
