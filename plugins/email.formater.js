


module.exports = function( mailOptions, data) {

    mailOptions.subject = 'You have received a new lead!' ;
    mail.Option.html = `<h2>Contact Details</h2><b>Name: </b>${data.name}<br><b>email:</b>${data.email}<br><b>Phone:</b>${data.phone}<br>` ;
    
    if (message !== undefined) {
        mailOptions.subject = "You have a customer support request" ;
        mailOptions.html = `<h2>Contact Details</h2><b>Name: </b>${data.name}<br><b>email:</b>${data.email}<br><b>Message:</b>${data.message}<br>` ;
    }

    return mailOptions ;

}