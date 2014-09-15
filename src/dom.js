module.exports = {
  $: function () {

    if (global.jQuery) {
      this.$ = global.jQuery;
      return this.$.apply(this.$, arguments);
    } else if (typeof window !== 'undefined') {
      this.$ = require('jquery');
      return this.$.apply(this.$, arguments);
    }

  },
  document: global.document,
  setWindow: function (window) {
    this.$ = require('jquery')(window);
    this.document = window.document;
  }
};