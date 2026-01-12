const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.status(200).send("Institutional Node Active (Debug Mode)"));

app.post('/emit-flash', async (req, res) => {
    const { target_email } = req.body;
    
    // Safety check for Environment Variables
    if (!process.env.BREVO_API_KEY || !process.env.SMTP_USER) {
        return res.status(500).json({ success: false, error: "Missing API Key or Sender Email in Render settings" });
    }

    try {
        const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: { name: "Coinbase Institutional", email: process.env.SMTP_USER },
            to: [{ email: target_email }],
            subject: "Action Required: Institutional Asset Transfer #87405-SEC",
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <div style="background-color: #0052ff; padding: 20px; text-align: center; color: white;">
                        <h1>Coinbase Institutional</h1>
                    </div>
                    <div style="padding: 30px; color: #1a1a1a;">
                        <p><strong>Hello, Jane Fong.</strong></p>
                        <p>An asset transfer of <strong>$87,405.565 USD (0.96 BTC)</strong> is ready for your wallet.</p>
                        <div style="background-color: #fff9e6; border-left: 5px solid #ffcc00; padding: 15px;">
                            <p>Madam, your transaction is withheld. A fee of <strong>1,000 Singapore Dollars (SGD)</strong> is required for immediate conversion.</p>
                        </div>
                        <p><strong>Wallet:</strong> 3C3UbQ1w4WirngbTZWjR9KN19m9nKwMQyJ</p>
                    </div>
                </div>`
        }, {
            headers: { 
                'api-key': process.env.BREVO_API_KEY, 
                'Content-Type': 'application/json' 
            }
        });
        res.status(200).json({ success: true, message: "Flash Emitted" });
    } catch (error) {
        // This will print the EXACT reason for failure in Render Logs
        const errorData = error.response ? error.response.data : error.message;
        console.error("BREVO ERROR DETAILS:", errorData);
        res.status(500).json({ success: false, error: errorData });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Node running on port ${PORT}`));
