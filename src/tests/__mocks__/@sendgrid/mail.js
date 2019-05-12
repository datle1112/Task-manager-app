// We use Mocking to run our own function during test
// In this case, we don't want to send email to user during test since it will reduce amount of allowed email (sendgrid free tier accout) 
// or wasting money when we upgrade our sendgrid account 
module.exports = { // The functions of @sendgrid/mail library are re-defined here 
    setApiKey() {

    },
    send() {

    }
}