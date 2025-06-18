const nodemailer = require("nodemailer");

module.exports.sendMail = (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
            user: "maddison53@ethereal.email",
            pass: "jn7jnAPss4f63QBp6D",
        },
    });


    async function main() {
    const info = await transporter.sendMail({
        from: 'phongtnck57@gmail.com',
        to: email,
        subject: subject, 
        html: html,
    });

    console.log("Message sent: %s", info.messageId);
    }

    main().catch(console.error);

}