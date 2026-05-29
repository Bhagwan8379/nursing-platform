const nodeMailer = require("nodemailer")

const sendEmail = ({ email, subject, message }) => new Promise((resolve, reject) => {
    const mailer = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.FROM_EMAIL,
            pass: process.env.EMAIL_PASS
        }
    })
    mailer.sendMail({
        to: email,
        subject: subject,
        text: message
    }, err => {
        if (err) {
            console.log(err)
            console.log("Unable To Send Email")
            reject("Unable To Send Email")
        } else {
            console.log("email Send Successfully");
            resolve("email Send Successfully");

        }
    })
})

module.exports = sendEmail