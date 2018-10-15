const {TokenType, createToken} = require('../../common/Token.js')
const TokenError = require('../../common/TokenError.js');
const { Transform } = require('stream');

const FRACTIONAL_DIVISOR = '.';
const NUMBER_PATTERN = /^(\d|\.)+$/;
const ID_PATTERN = /^([_a-zA-Z0-9])+$/;

class Tokenizer extends Transform {
    constructor(opts = {}) {
        super(Object.assign(opts, {readableObjectMode: true}));
        const that = this;
        this.on('pipe', function(source) {
            source.on('finish', function() {
                that.push(createToken(TokenType.END));
            });
        });
    }
    _transform(word, encoding, callback) {
        this.push(readToken(word.toString()));
        callback();
    }
};

/**
 * @param {string} word
 * @return {Token}
 */
function readToken (word) {
    try {
        switch (word) {
            case '+':
                return createToken(TokenType.PLUS);
            case '-':
                return createToken(TokenType.MINUS);
            case '*':
                return createToken(TokenType.MUL);
            case '/':
                return createToken(TokenType.DIV);
            case '=':
                return createToken(TokenType.ASSIGN);
            default:
                return toToken(word);    
        }
    } catch (e) {
        if (e instanceof TokenError) {
            return createToken(TokenType.ERROR, e.tokenValue);
        }    
        throw e;            
    }
}

/**
 * @param {string} word
 * @throws {TokenError}
 * @return {Token}
 */
function toToken(word) {

    if (validateNumber(word)) {
        return createToken(TokenType.NUMBER, word);
    }

    if (validateId(word)) {
        return createToken(TokenType.ID, word);
    }

    throw new TokenError("Parse error", word);
}

/**
 * @param {string} number
 * @return {boolean}
 */
function validateNumber (number) {
    // Consist of allowed characters
    if (!NUMBER_PATTERN.test(number)) {
        return false;
    }

    // Number can start with 0 only if second char is fractional divisor 
    if (number.length > 1 && number[0] === '0' && number[1] !== FRACTIONAL_DIVISOR) {
        return false;
    }

    // Fractional divisor must be between digits
    if (number[0] === FRACTIONAL_DIVISOR || number[number.length - 1] === FRACTIONAL_DIVISOR) {
        return false;
    }

    return true;
}

/**
 * @param {string} id
 * @return {boolean}
 */
function validateId (id) {
    // Consist of allowed characters
    if (!ID_PATTERN.test(id)) {
        return false;
    }

    // Starts with non-digit character
    if (NUMBER_PATTERN.test(id[0])) {
        return false;
    }

    return true;
}

module.exports = Tokenizer;