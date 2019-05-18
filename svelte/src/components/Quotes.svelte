{{#if quotes.length === 0}}
    <p>Quotes loading...</p>
{{else}}
    {{#each quotes as quote}}
    <div class="quote">
        {{{quote.content}}}
        <p class="author">- {{quote.title}}</p>
    </div>
    {{/each}}
{{/if}}

<style>
  .quote {
    background: #efefef;
    border: 1px solid #ccc;
    font-size: 18px;
    margin-bottom: 30px;
    padding: 20px;
  }
  .author {
    text-align: right;
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
</style>