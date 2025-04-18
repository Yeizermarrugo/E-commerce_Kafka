const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: process.env.SMTP_USER || "2cc439c567232c",
		pass: process.env.SMTP_PASS || "7cbd7298357c07"
	}
});

const sendEmail = async ({ to, subject, content }) => {
	await transporter.sendMail({
		from: '"E-Commerce 👨‍💻" <no-reply@ecommerce.com>',
		to,
		subject,
		text: content,
		html: `<p>${content}</p>`
	});
};

module.exports = { sendEmail };
