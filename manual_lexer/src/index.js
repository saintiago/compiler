const Letterer = require('./Letterer');
const Worder = require('./Worder');
const Tokenizer = require('./Tokenizer');

/**
 * @param {Readable} source 
 * @param {Writable} destination 
 */
function Lexer(source, destination) {
    source
        .pipe(new Letterer())
        .pipe(new Worder())
        .pipe(new Tokenizer())
        .pipe(destination);
}

module.exports = Lexer;