require('dotenv').config();
const nodemailer = require('nodemailer');

async function debugConnection() {
    console.log("--- STARTING DEBUG HANDSHAKE ---");
    console.log("Target Email: " + process.env.SENDER_EMAIL);

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.APP_PASSWORD
        },
        debug: true,      // THIS IS THE IMPORTANT PART
        logger: true      // SHOWS EVERY DETAIL
    });

    try {
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: process.env.SENDER_EMAIL, // Send to yourself for the test
            subject: "Debug Handshake",
            text: "Testing connection only."
        });
        console.log("--- RESULT: SUCCESS! ---");
    } catch (e) {
        console.log("--- RESULT: FAILED ---");
        console.error("DEBUG ERROR TYPE:", e.code);
        console.error("FULL MESSAGE:", e.message);
    }
}

debugConnection();

