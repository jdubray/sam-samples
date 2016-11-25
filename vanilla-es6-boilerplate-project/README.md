# SAM ES6 Boilerplate Project

SAM is [a new reactive functional pattern](http://sam.js.org) which greatly simplifies the architecture of front-ends (native or Web).

This project provides a basic SAM structure (actions, model, state, view) and a componentized theme. The theme comes with three familiar sections (header, page, footer) and can be used to implement HTML5 themes.

The project uses [Google traceur](https://github.com/google/traceur-compiler) to automatically transpile E6 to ES5, an node.js as a Web server. The initial value of the model can be imported from a file (./component/model.data.js) or served from node.js (as a dynamically built javascript file).

## Files

`|
 |--/sam              the basic SAM structure
 |--/components       the application / site components
 |--/plugins          back-end plugins
 |--server-model.js   node as a Web server (can host APIs as well)
 |--data.js           Initial value of the model, when served from node`

 ## Files

 `
 npm install
 node server-model.js
 `

 Open [http://localhost:5425/html](http://localhost:5425/html)
