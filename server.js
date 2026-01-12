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
            htmlContent: `<div style="font-family: Arial; padding: 20px; border: 2px solid #0052ff;">
                            <h2>Coinbase Institutional</h2>
                            <p>Transfer of <b>$${amount}</b> is pending authorization.</p>
                          </div>`
        }, {
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        console.log("API Success:", response.data);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, error: "API connection failed" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Node running on port ${PORT}`));
