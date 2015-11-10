var Highlight = require('./highlight');
var hljs = new Highlight();
hljs.registerLanguage('javascript', require('./languages/javascript.js'));
hljs.registerLanguage('qartulskripti', require('./languages/qartulskripti.js'));
module.exports = hljs;