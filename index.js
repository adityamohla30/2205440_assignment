const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(bodyParser.json());

const notifications = {};
let notificationQueue = [];
let processing = false;

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Notification Service API',
            version: '1.0.0',
            description: 'API documentation for Notification Service',
        },
    },
    apis: ['./index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- ADD THIS ROOT ROUTE ---
app.get('/', (req, res) => {
    res.send(
        `<h2>Notification Service is running!</h2>
        <p>Visit <a href="/api-docs">/api-docs</a> for API documentation.</p>`
    );
});
// ---------------------------

/**
 * @openapi
 * /notifications:
 *   post:
 *     summary: Send a notification (email, SMS, or in-app)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [email, sms, in-app]
 *               message:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification sent
 *       400:
 *         description: Bad request
 */

/**
 * @openapi
 * /users/{id}/notifications:
 *   get:
 *     summary: Get all notifications for a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of notifications
 */

async function sendEmailWithRetry(email, message, maxRetries = 3) {
    let attempt = 0;
    let lastError = null;
    while (attempt < maxRetries) {
        try {
            let testAccount = await nodemailer.createTestAccount();
            let transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            let info = await transporter.sendMail({
                from: '"Notification Service" <no-reply@example.com>',
                to: email,
                subject: "Notification",
                text: message
            });
            console.log('Preview email URL:', nodemailer.getTestMessageUrl(info));
            return true;
        } catch (err) {
            lastError = err;
            attempt++;
            console.log(`Email send failed (attempt ${attempt}), retrying...`);
        }
    }
    throw lastError;
}

async function sendSMSWithRetry(phone, message, maxRetries = 3) {
    let attempt = 0;
    let lastError = null;
    while (attempt < maxRetries) {
        try {
            if (Math.random() < 0.5) throw new Error("Simulated SMS failure");
            console.log(`Simulated SMS sent to ${phone}: ${message}`);
            return true;
        } catch (err) {
            lastError = err;
            attempt++;
            console.log(`SMS send failed (attempt ${attempt}), retrying...`);
        }
    }
    throw lastError;
}

async function processQueue() {
    if (processing) return;
    processing = true;
    while (notificationQueue.length > 0) {
        const job = notificationQueue.shift();
        const { userId, type, message, email, phone, idx } = job;
        try {
            if (type === 'email') {
                await sendEmailWithRetry(email, message);
            } else if (type === 'sms') {
                await sendSMSWithRetry(phone, message);
            }
            notifications[userId][idx].status = 'sent';
        } catch (err) {
            notifications[userId][idx].status = 'failed';
            notifications[userId][idx].error = err.message;
        }
    }
    processing = false;
}

app.post('/notifications', (req, res) => {
    const { userId, type, message, email, phone } = req.body;
    if (!userId || !type || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (type === 'email' && !email) {
        return res.status(400).json({ error: 'Missing email for email notification' });
    }
    if (type === 'sms' && !phone) {
        return res.status(400).json({ error: 'Missing phone for SMS notification' });
    }
    if (!notifications[userId]) notifications[userId] = [];
    const idx = notifications[userId].length;
    notifications[userId].push({ type, message, status: 'pending' });
    if (type === 'email' || type === 'sms') {
        notificationQueue.push({ userId, type, message, email, phone, idx });
        processQueue();
    } else {
        notifications[userId][idx].status = 'sent';
    }
    res.status(201).json({ success: true });
});

app.get('/users/:id/notifications', (req, res) => {
    const userId = req.params.id;
    res.json(notifications[userId] || []);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
