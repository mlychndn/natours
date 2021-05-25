const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');


module.exports = class Email {
    constructor(users, url){
        this.to = users.email;
        this.firtsName = users.name.split(' ')[0];
        this.url = url;
        this.from = `Malay Chandan <${process.env.EMAIL_FROM}>`
    }

    newTransport(){
        if(process.env.NODE_ENV === 'production'){
            //sendGrid
            return 1;
        }
        return nodemailer.createTransport({
            host:process.env.EMAIL_HOST,
            port:process.env.EMAIL_PORT,
            auth: {
                user:process.env.EMAIL_USERNAME,
                pass:process.env.EMAIL_PASSWORD
            }
        });
    }

    async send(template, subject){
        // 1. Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
            firstName: this.firstName,
            url: this.url,
            subject
        });


        // 2. define email options
         const mailOptions = {
             from: this.from,
             to: this.to,
             subject,
             html,
             text: htmlToText.fromString(html)
            }

        // 3. send mail
        await this.newTransport().sendMail(mailOptions);


    }

    async sendWelcome(){
        await this.send('Welcome', 'Welcome to our family!')
    }
    
    async sendPasswordReset(){
        await this.send('forgotPassword', 'Your password reset token (valid for 10 minutes only')
    }
}


 

