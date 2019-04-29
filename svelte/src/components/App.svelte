<div id="app">
  <h1>Great Quotes</h1>
  <p style="margin: 0 0 30px">Curated by Chris Coyier</p>
    {{#if quotes.length === 0}}
      <p>Quotes loading...</p>
    {{else}}
      <Quotes quotes={{quotes}} />
    {{/if}}
  <button on:click='fetchQuotes()'>Load More</button>
</div>

<script type="text/javascript">
  import Quotes from './Quotes.svelte';

  // Svelte is built on the principle that it can react to changes to the model
  // If we were to pass the whole model in component.set(...) it would always
  // render everything, as opposed to the components that depend on the parts
  // of the model that changed
  // The diff function computes the difference between two objects
  let diff = (a,b) => Object.keys(b).reduce((diff, key) => {
    if (a[key] === b[key]) return diff
    return {
      ...diff,
      [key]: b[key]
    }
  }, {})

  // Actions 
  const fetchQuotes = async (present = model.present) => {
    const response = await fetch(`http://quotesondesign.com/wp-json/posts?filter[order]=rand&filter[posts_per_page]=3`);
    const proposal = { quotes: await response.json() };
    // present proposal to model
    present(proposal);
  }

  // Model
  const model = {
    quotes: [],
    present(proposal) {
      // acceptors

      // quotes acceptor
      if (proposal.quotes) {
        model.quotes = model.quotes.concat(proposal.quotes);
      }

      // Continue to state representation
      state()
    }
  }

  // State Represenation
  let state;

  const init = (component, start) => {
    state = () => {
      // Reactors would go here
      
      // We need to compute the diff between the SAM model
      // and Selve's model otherwise Svelte would render 
      // everything
      component.set(diff(component.get(), model));
    }
    // Start
    start();
  }

  // export the default object
  export default {
    oncreate() {
      init(this, fetchQuotes);
    },
    // Svelte methods are identical to SAM actions
    // Per Svelte's spec, the method property must
    // be an object literal
    methods: {
      fetchQuotes
    },
    components: {
      Quotes
    }
  };
</script>

<style>
  h1 {
    margin: 0 0 10px;
  }
  p {
    line-height: 1.4;
  }
  button {
    font-family: inherit;
    font-size: inherit;
    padding: 0.4em;
    margin: 0 0 0.5em 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 2px;
  }
  #app {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    margin: 50px auto;
    max-width: 600px;
  }
</style>