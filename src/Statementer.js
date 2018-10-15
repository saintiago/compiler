const {Transform} = require('stream');
const {TokenType} = require('./Token');

class Statementer extends Transform {
    constructor(opts = {}) {
        super(Object.assign(opts, {readableObjectMode: true, writableObjectMode: true}));
        this.tokenBuffer = [];
    }

    /**
     * @param {Token} token 
     * @param {string} encoding 
     * @param {function} callback 
     */
    _transform(token, encoding, callback) {
        token.type === TokenType.STMT_END || token.type === TokenType.END
            ? this.flushBuffer() 
            : this.tokenBuffer.push(token);
        callback();
    }

    flushBuffer() {
        this.push(this.tokenBuffer);
        this.tokenBuffer = [];
    }
};

module.exports = Statementer;