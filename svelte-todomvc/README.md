# svelte-todomvc

**[svelte-todomvc.surge.sh](http://svelte-todomvc.surge.sh/)**

[TodoMVC](http://todomvc.com/) implemented in [Svelte](https://github.com/sveltejs/svelte). The entire app weighs 3.5kb zipped.

## Troubleshooting

If `npm run start` returns an error, replace the copyfiles script in package.json with:
```
"copyfiles": "rm -rf dist && cp node_modules/todomvc-app-css/index.css public/todomvc-app-css.css && cp node_modules/todomvc-common/base.css public/todomvc-common.css && cp node_modules/todomvc-common/base.js public/todomvc-common.js",
```
