import App from './components/App.svelte';

const app = new App({
  target: document.querySelector('main'),
  data: {
    quotes: [{
      content: 'Part of the journey is the end',
      title: 'Tony Stark'
    }]
  },
});