[![Build Status](https://travis-ci.org/akveo/ng2-admin.svg?branch=master)](https://travis-ci.org/akveo/ng2-admin)
[![Dependency Status](https://david-dm.org/akveo/ng2-admin.svg)](https://david-dm.org/akveo/ng2-admin)

# Admin panel framework based on Angular 2, Bootstrap 4 and Webpack

This is SAM implementation of Akveo ng2 admin panel framework.

Admin template made with :heart:  by [Akveo team](http://akveo.com/). Follow us on [Twitter](https://twitter.com/akveo_inc) to get latest news about this template first!

## How is the SAM pattern implemented

This is work in progress, so currently, only the following components have been converted to use the SAM pattern:
* /app/pages/dashboard/*


The [SAM pattern](http://sam.js.org) elements (actions, state, model) are instantiated from the SamFactory (/app/services/sam.service) in the app.component

* The Actions are mounted in a global variable `actionsMount` (index.html). This global variable is visible from any component and wired to the component's events when you use the following statement:
```
declare var actionsMount: any;
```

There are better ways to achieve the same result (such as creating a dispatcher service) which I am currently exploring.

* The Model (as a single state tree) can be found in /app/model/model. It's structure will be refined as I make progree in converting the template to a full SAM implementation.

* The State Representation function is implemented in /app/state/app.state. At present, the components subsbscribe to changes to the State Representation. For instance the feed component's subscription looks like this:
```
this._state.subscribe('dashboard.feed', 
     (feed) => {
        this._feed = feed;
        this.ref.detectChanges() ;
      });
```

When the State function detects an update to the state representation related to that subscription, it notifies its subscribers:
```
this._onEvent({event:'dashboard.feed',data:model.feed});
```

As a result, the view component's callback simply refreshes the component's properties. 




### Demo

<a target="_blank" href="http://akveo.com/ng2-admin/"><img src="http://i.imgur.com/QK9AzHj.jpg" width="600" alt="Sky Blue"/></a>

<a target="_blank" href="http://akveo.com/ng2-admin/">Live Demo @Akveo</a>
 
## Documentation
Installation, customization and other useful articles: https://akveo.github.io/ng2-admin/

## Based on
Angular 2, Bootstrap 4, Webpack and lots of awesome modules and plugins

## How can I support developers?
- Star our GitHub repo :star:
- Create pull requests, submit bugs, suggest new features or documentation updates :wrench:
- Follow us on [Twitter](https://twitter.com/akveo_inc) :feet:
- Like our page on [Facebook](https://www.facebook.com/akveo/) :thumbsup:

## Can I hire you guys?
Yes!  Visit [our homepage](http://akveo.com/) or simply leave us a note to [contact@akveo.com](mailto:contact@akveo.com). We will be happy to work with you!

## Features
* TypeScript
* Webpack
* Responsive layout
* High resolution
* Bootstrap 4 CSS Framework
* Sass
* Angular 2
* jQuery
* Charts (Chartist, Chart.js)
* Maps (Google, Leaflet, amMap)
* and many more!

##License
[MIT](LICENSE.txt) license.

### From akveo

Enjoy :metal:
We're always happy to hear your feedback!
