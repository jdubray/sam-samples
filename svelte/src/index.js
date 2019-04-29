import App from './components/App.svelte';
const app = new App({
  target: document.querySelector('main'),
  data: {
    quotes: []
  },
});