const Letterer = require('./Letterer');
const Worder = require('./Worder');
const Tokenizer = require('./Tokenizer');
const Statementer = require('./Statementer');

/**
 * @param {Readable} source 
 * @param {Writable} destination 
 */
function Compiler(source, destination) {
    source
        .pipe(new Letterer())
        .pipe(new Worder())
        .pipe(new Tokenizer())
        .pipe(new Statementer())
        .pipe(destination);
}

module.exports = Compiler;