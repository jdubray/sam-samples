<div id="app">
  <h1>Great Quotes</h1>
  <p style="margin: 0 0 30px">Curated by Chris Coyier</p>
  <Quotes quotes={{quotes}} />
  <button on:click='loadMoreQuotes()'>Load More</button>
</div>

<script type="text/javascript">
  import SAM from '../SAM';
  import Quotes from './Quotes.svelte';

  // Svelte is built on the principle that it can react to changes to the model
  // If we were to pass the whole model in component.set(...) it would always
  // render everything, as opposed to the components that depend on the parts
  // of the model that changed
  // The diff function computes the difference between two objects
  let diff = (a,b) => Object.keys(b).reduce(
      (d, key) => {
          if (a[key] === b[key]) return d
          return {
              ...d,
              [key]: b[key]
          }
      }, 
      {}
  )

  // Actions 
  const fetchQuotes = (present) => async () => {
    const response = await fetch(`http://quotesondesign.com/wp-json/posts?filter[order]=rand&filter[posts_per_page]=3`);
    const proposal = { quotes: await response.json() };
    // present proposal to model
    present(proposal);
  }

  // Acceptors
  const quoteAcceptor = (model) => (proposal) => {
      if (proposal.quotes) {
        model['quotes'] = model['quotes'].concat(proposal.quotes);
      }
  }

  let [fetchQuotesIntent] = SAM({ actions: [fetchQuotes], acceptors: [quoteAcceptor], reactors: [] });

  // export the default object
  export default {
    oncreate() {
      // We need to compute the diff between the SAM model
      // and Selve's model otherwise Svelte would render 
      // everything
      const render = state => this.set(diff(this.get(), state));

      SAM(this, fetchQuotesIntent, render);
    },
    // Svelte methods are identical to SAM actions
    // Per Svelte's spec, the method property must
    // be an object literal
    methods: {
      loadMoreQuotes() {
        SAM(this, fetchQuotesIntent);
      }
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
  #app {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    margin: 50px auto;
    max-width: 600px;
  }
</style>