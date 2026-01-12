const nodemailer = require('nodemailer');

async function sendProfessional() {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'chisomboniface47@gmail.com',
            pass: 'uvfssibaapelhkae'
        }
    });

    const targetEmails = ["Chinomaley7@gmail.com", "MexRob@proton.me"];

    // Professional HTML Template
    const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px;">
        <h2 style="color: #1a73e8; border-bottom: 2px solid #1a73e8; padding-bottom: 10px;">Institutional Ledger Alert</h2>
        <p>This is an automated notification regarding a pending digital asset allocation.</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #ddd;"><b>Reference ID:</b></td>
                <td style="padding: 10px; border: 1px solid #ddd;">TXN-99284-F</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><b>Status:</b></td>
                <td style="padding: 10px; border: 1px solid #ddd; color: #d93025;">Pending Release</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #ddd;"><b>Total Value:</b></td>
                <td style="padding: 10px; border: 1px solid #ddd;">$87,405.565 USD</td>
            </tr>
        </table>

        <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 4px; border: 1px solid #ffeeba;">
            <b>Action Required:</b> Please complete the necessary network conversion protocol to finalize this emission to your destination wallet.
        </div>

        <p style="font-size: 12px; color: #777; margin-top: 30px;">
            This is a system-generated message. Do not reply to this email.
        </p>
    </div>
    `;

    let mailOptions = {
        from: '"Asset Management" <chisomboniface47@gmail.com>',
        to: targetEmails.join(', '),
        subject: "Institutional Alert: $87,405.565 Pending Release",
        html: htmlContent
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("SUCCESS: Professional Alert Emitted.");
        console.log("ID: " + info.messageId);
    } catch (error) {
        console.error("Error:", error);
    }
}

sendProfessional();

