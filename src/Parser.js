const {Transform} = require('stream');

class Parser extends Transform {
    constructor(opts = {}) {
        super(Object.assign(opts, {writableObjectMode: true}));
    }

    /**
     * @param {token} token 
     * @param {string} encoding 
     * @param {function} callback 
     */
    _transform(token, encoding, callback) {
        this.push(number(token) + '');
        callback();
    }
};

/**
 * @param {Token} token 
 * @return {number}
 */
function number(token) {
    return +token.value;
}

/**
 * @param {Token[]} tokens
 * @return {number}
 */
function expression(tokens) {
    
}

module.exports = Parser;