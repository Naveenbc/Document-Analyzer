class ManualAnalyzer {
    constructor() {
      this.dict = {};
      this.keys = [];
    }
  
  
    // Splitting up the text
    async split(text) {
      // Split into array of tokens
      return text.split(/\W+/);
    }
  
    // A function to validate a toke
    async validate(token) {
      return /\w{2,}/.test(token);
    }
  
    // Process new text
    async process(data) {
      var tokens =  await this.split(data);
      // For every token
      for (var i = 0; i < tokens.length; i++) {
        // Lowercase everything to ignore case
        var token = tokens[i].toLowerCase();
        if (await this.validate(token)) {
          // Increase the count for the token
          await this.increment(token);
        }
      }
      return await this.sortByCount();
    }
  
    // Get the count for a word
    getCount(word) {
      return this.dict[word];
    }
  
    // Increment the count for a word
    async increment(word) {
      // Is this a new word?
      if (!this.dict[word]) {
        this.dict[word] = 1;
        this.keys.push(word);
        // Otherwise just increment its count
      } else {
        this.dict[word]++;
      }
    }
  
    // Sort array of keys by counts
    async sortByCount() {
      // For this function to work for sorting, I have
      // to store a reference to this so the context is not lost!
      var concordance = this;
  
      // A fancy way to sort each element
      // Compare the counts
      function sorter(a, b) {
        var diff = concordance.getCount(b) - concordance.getCount(a);
        return diff;
      }
  
      // Sort using the function above!
      this.keys.sort(sorter);
      let top10Keys = this.keys.slice(0,10);
      let topKeysWithCount = []
      for(let i of top10Keys) {
        topKeysWithCount.push({'word' : i, 'count': this.dict[i]});
      }
      return topKeysWithCount;
    }
  
  }
  module.exports = ManualAnalyzer;