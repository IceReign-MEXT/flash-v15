const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => res.status(200).send("Institutional Node Active (API Mode)"));
app.post('/emit-flash', async (req, res) => {
    const { target_email, amount } = req.body;
    try {
        const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: { name: "Coinbase Institutional", email: process.env.SMTP_USER },
            to: [{ email: target_email }],
            subject: `Institutional Alert: Asset Transfer of $${amount} Pending`,
            htmlContent: `
                <div style="font-family: Arial; padding: 20px; border: 2px solid #0052ff; border-radius: 10px;">
                    <h2 style="color: #0052ff;">Coinbase Institutional</h2>
                    <p style="font-size: 16px;">An institutional asset transfer has been detected and is awaiting your authorization.</p>
                    <div style="background-color: #f4f7f9; padding: 15px; border-radius: 5px;">
                        <p><strong>Amount:</strong> <span style="color: #058527;">$${amount} USD</span></p>
                        <p><strong>Status:</strong> Pending Verification</p>
                    </div>
                    <p>Please log in to your dashboard to confirm this transaction.</p>
                </div>`
        }, {
            headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json' }
        });
        res.status(200).json({ success: true, message: "Flash emitted via API" });
    } catch (error) {
        res.status(500).json({ success: false, error: "API Failed" });
    }
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Node running on port ${PORT}`));
