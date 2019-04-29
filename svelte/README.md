# Svelte Code Sample

This code sample is a fork of John Hannah's [Quotes tutorial](https://github.com/j-hannah/svelte-quotes)

## SAM Loop

The SAM Loop includes actions, the model and the state function.

- SAM actions are strictly equivalent to Svelte's methods (but the methods property must be an object literal)
- The model is implemented as usual with acceptors and controls all mutations
- Unfortunately does not makes it easy to control the rendering process. It's not possible to add a render function to the Svelte component, to the initialization and implementation of the State representation function is a bit too coupled to Svelte for my taste (note that we can only use export default).

## Install

```
npm install
```

## Run

```
npm run start
```