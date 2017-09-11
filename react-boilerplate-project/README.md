# SAM React Boilerplate Project

SAM is [a new reactive functional pattern](http://sam.js.org) which greatly simplifies the architecture of front-ends (native or Web).

This project provides a basic SAM structure (actions, model, state, view) and a componentized theme. The theme comes with three familiar sections (header, page, footer) and can be used to implement HTML5 themes.

The project uses [React](https://facebook.github.io/react/) in a minimalist way (as a virtual DOM).

## Files

```
 |
 |--/sam              the basic SAM structure
 |--/components       the application / site components
 |--/plugins          back-end plugins
 |--server-model.js   node as a Web server (can host APIs as well)
 |--data.js           Initial value of the model, when served from node
 ```

## Install

 ```
 npm install
 node server-model.js
 ```
## Edit/Build the project

```
npm run build
node server-model.js
```
 
 Open [http://localhost:5425/html](http://localhost:5425/html)
