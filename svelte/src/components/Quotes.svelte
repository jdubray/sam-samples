{{#each quotes as quote}}
  <div class="quote">
    {{{quote.content}}}
    <p class="author">- {{quote.title}}</p>
  </div>
{{/each}}

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
</style>