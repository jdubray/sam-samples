

export var data = {
        menuItem : 'home',
        header : { menu: [ { active: true, href: "home", label: "Home" }, { href: "whatwedo", label: "What we do" }, { href: "contactus", label: "Contact Us" } ],
            facebook: "https://www.facebook.com/",
            twitter: "https://www.twitter.com",
            linkedin: "https://www.linkedin.com/"
        },

        footer: {
            description: "SAM is a new pattern that makes it easy to build beautiful Web Sites",
            telephone: "+1-800-555-1212",
            email: "info@yourdomain.com",
            facebook: "https://www.facebook.com/",
            twitter: "https://www.twitter.com",
            linkedin: "https://www.linkedin.com/"
        },
        
        home: {
            imgs: ["img/background1.jpg"],  
            parallax: { img: "img/background2.jpg"},
            valueProposition: [
                {icon:"comments-o", title: "Frequently Asked Questions", description: ""},
                {icon:"laptop", title: "Instant Charterbus Quote", description: ""},
                {icon:"users", title: "Our Premium Partners", description: ""}],
        },
        
        contactus: {  title: "Contact Us",  
                        content: "Our customer support services are the best in the business. They’re standing by to help you.", 
                        address: "3600 136th Pl SE #300", 
                        city: "Bellevue, WA 98006", 
                        telephone: "+1-866-555-1212",
                        email: "info@yourdomain.com",
                        lat: 47.578592, lng:-122.1542519,
                        thankyou: "Thank you! Your message has been received"
        }
    } ;
