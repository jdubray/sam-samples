# An Isomorphic CRUD Application implementing the SAM Pattern

This sample was inspired by the blog post from @rajaraodv on [building a React/Redux CRUD App](https://medium.com/@rajaraodv/a-guide-for-building-a-react-redux-crud-app-7fe0b8943d0f#.ydbwd6ccl)

The client-side version of this sample is [hosted on HyperDev](https://fish-trader.hyperdev.space/)

The project contains 4 files:

- blog.html 	/ the client
- blog.js   	/ the isomorphic app
- server.js 	/ the server
- package.json 	/ you know the drill	

If you want to use the (optional) Postman library that creates a Postman collection from the APIs of your app, you can download it [here](https://bitbucket.org/jdubray/postman)

You can switch between the client or client/server app by commenting out the corresponding lines in these two functions (blog.html):

```

	function present(data) {
		// client side
		//model.present(data) ;

		// server side
		$.post( "http://localhost:5425/app/v1/present", data) 
		.done(function( representation ) {
			$( "#representation" ).html( representation );
		}		
		);
	}

	function init() {
		// client side
		//view.display(view.init(model)) ;

		// server side
		$.get( "http://locahost:5425/app/v1/init", function( data ) {
			$( "#representation" ).html( data );
		}		
		);
	}

```

to start the server:
```

	$ npm install
	$ node server

```

You can check if the server is running correctly by [opening this URL](http://localhost:5425/app/v1/init)