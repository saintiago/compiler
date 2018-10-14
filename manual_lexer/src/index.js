const Letterer = require('./Letterer');
const Worder = require('./Worder');
const Tokenizer = require('./Tokenizer');

/*const {PassThrough} = require('stream');

class Lexer extends PassThrough {
    constructor(opts = {}) {
        super(Object.assign(opts, {readableObjectMode: true}));
        this.transformStream = null;
        this.on('pipe', function(source) {
            source.unpipe(this);
            this.transformStream = source
                .pipe(new Letterer())
                .pipe(new Worder())
                .pipe(new Tokenizer());
        }.bind(this));
    }

    pipe (destination, options) {
        return this.transformStream.pipe(destination, options);
    };
}*/

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