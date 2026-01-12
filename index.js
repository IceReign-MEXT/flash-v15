const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.')));

// UPDATED SMTP: Switching to Port 587 for better Cloud compatibility
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Must be false for 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Helps bypass cloud firewall issues
    },
    connectionTimeout: 15000 // Increased to 15s to prevent ETIMEDOUT
});

// Pulse Check
transporter.verify((error, success) => {
    if (error) {
        console.log("!!! RELAY ERROR: Handshake Failed. Check variables.");
        console.error(error);
    } else {
        console.log(">>> SMTP RELAY ACTIVE: Sovereign Engine is ready.");
    }
});

app.post('/send-flash', (req, res) => {
    const { platform, email, amount_usd, amount_crypto, wallet, warning } = req.body;

    const mailOptions = {
        from: `"${platform} Institutional" <no-reply@${platform.toLowerCase()}.com>`,
        to: email,
        subject: `Institutional Alert: ${amount_usd} ${amount_crypto} Pending Release`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eef2f7; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                <div style="background-color: #0052FF; padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 800;">${platform} Institutional</h1>
                </div>
                <div style="padding: 40px; background-color: #ffffff;">
                    <h2 style="color: #050f19; margin-top: 0; font-size: 26px;">Transaction on Hold</h2>
                    <p style="color: #4a5568; font-size: 16px;">An incoming transfer of <strong>${amount_crypto}</strong> (Value: <strong>${amount_usd}</strong>) is flagged for address:</p>
                    <div style="background-color: #f7fafc; padding: 20px; border-radius: 12px; font-family: monospace; font-size: 13px; color: #1a202c; margin: 25px 0; border: 1px solid #edf2f7; word-break: break-all;">${wallet}</div>
                    <div style="background-color: #fffaf0; border-left: 5px solid #ed8936; padding: 25px; margin: 30px 0;">
                        <p style="color: #744210; font-size: 15px; margin: 0; line-height: 1.6;">"${warning}"</p>
                    </div>
                    <p style="font-size: 12px; color: #a0aec0; margin-top: 40px; border-top: 1px solid #edf2f7; padding-top: 25px;">
                        Reference ID: ${platform.toUpperCase()}-${Math.floor(Math.random() * 90000000)}<br>
                        Security: AES-256 Bit Encrypted
                    </p>
                </div>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("!!! EMISSION FAILED:", error.message);
            return res.status(500).json({ success: false, message: error.message });
        }
        console.log(">>> FLASH EMITTED:", info.response);
        res.json({ success: true });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`>>> Fleet Operational on Port ${PORT}`));
