const webpush = require('../utils/webpush.config');
const Subscription = require('../models/subscription.model');

exports.subscribe = (req, res) => {
    const subscription = req.body;
    Subscription.save(subscription);
    res.status(201).json({ message: 'Subscribed!' });
};

exports.sendNotification = async (req, res) => {
    const { subscription, title, body } = req.body;

    const payload = JSON.stringify({
        title: title || '📬 แจ้งเตือน!',
        body: body || 'คุณมีการอัปเดตใหม่',
    });

    let subs = Subscription.getAll();

    // ถ้าไม่มีใน DB ใช้อันที่ client ส่งมา
    if (!subs.length && subscription?.endpoint) {
        subs = [subscription];
    }
    
    if (!subs.length) {
        return res.status(400).json({ error: "❌ No valid subscription to send push." });
    }

    for (const sub of subs) {
        try {
            await webpush.sendNotification(sub, payload);
            // console.log("✅ Push sent to:", sub.endpoint);
        } catch (err) {
            console.error('❌ Failed to send push:', err.message);
        }
    }

    res.json({ message: 'Push sent!' });
};

