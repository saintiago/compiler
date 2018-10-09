const {TokenType, createToken} = require('./Token.js')
const TokenError = require('./TokenError.js');

const FRACTIONAL_DIVISOR = '.';

class CalcLexer {
    
    /** @param {string} source */
    constructor(source) {

        if (typeof source !== 'string') {
            throw new Error('Input source must be string');
        }

        /** @private {string} */
        this.source = source;
        /** @private {number} */
        this.position = 0;
        /** @private {RegExp} */
        this.numberPattern = /^(\d|\.)+$/;
        /** @private {RegExp} */
        this.idPattern = /^([_a-zA-Z0-9])+$/;
        /** @private {RegExp} */
        this.spacePattern = /^\s$/;
        /** @private {RegExp} */
        this.wordPartPattern = /^([^\+\-\*\/=\s])$/;

    }

    /**
     * @return {Token}
     */
    read() {
        try {

            this._skipSpaces();

            if (this._sourceEndReached()) {
                return createToken(TokenType.END);
            }

            const char = this.source[this.position];
    
            if (this._isWordPart(char)) {
                return this._readWord();
            }

            this.position++;

            switch (char) {
                case '+':
                    return createToken(TokenType.PLUS);
                case '-':
                    return createToken(TokenType.MINUS);
                case '*':
                    return createToken(TokenType.MUL);
                case '/':
                    return createToken(TokenType.DIV);
                case '=':
                    return createToken(TokenType.EQUALS);
            }

            return createToken(TokenType.ERROR, char);
        } catch (e) {
            if (e instanceof TokenError) {
                return createToken(TokenType.ERROR, e.tokenValue);
            }    
            throw e;            
        }
    }

    /** @private */
    _skipSpaces() {
        while (this._isSpace(this.source[this.position])) {
            this.position++;
        }
    }

    /**
     * @throws {TokenError}
     * @return {Token}
     */
    _readWord() {
        const word = this._readWordValue();

        if (this._validateNumber(word)) {
            return createToken(TokenType.NUMBER, word);
        }

        if (this._validateId(word)) {
            return createToken(TokenType.ID, word);
        }

        throw new TokenError("Parse error", word);
    }

    _readWordValue() {
        let value = '';
        let char = this.source[this.position];
        while (this._isWordPart(char) && !this._sourceEndReached()) {
            value += char;
            this.position++;
            if (this.source[this.position] === undefined) {
                break;
            }
            char = this.source[this.position];
        }
        return value;
    }

    /**
     * @private
     * @param {string} number
     */
    _validateNumber(number) {
        // Consist of allowed characters
        if (!this.numberPattern.test(number)) {
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

    _validateId(id) {
        // Consist of allowed characters
        if (!this.idPattern.test(id)) {
            return false;
        }

        // Starts with non-digit character
        if (this.numberPattern.test(id[0])) {
            return false;
        }

        return true;
    }

    _sourceEndReached() {
        return this.position >= this.source.length;
    }

    /**
     * @param {string} char 
     * @private 
     */
    _isSpace(char) {
        return this.spacePattern.test(char);
    }

        /**
     * @param {string} char 
     * @private 
     */
    _isWordPart(char) {
        return this.wordPartPattern.test(char);
    }
}

module.exports = CalcLexer;