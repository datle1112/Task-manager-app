const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email , name) => {
    sgMail.send({ // "send()" function return a Promise so we could use async-await 
        to : email,
        from : 'le.dat111297@gmail.com',
        subject : 'Thanks for joining in!!',
        text : `Welcome to the application ${name}`
    })
} 
const sendCancelEmail = (email , name) => {
    sgMail.send({
        to : email, 
        from : 'le.dat111297@gmail.com',
        subject : 'Cancel subscription',
        text : `Thanks for using my application ${name}`
    })
}
module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}