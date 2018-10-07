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
        this.numberPartPattern = /^(\d|\.)$/;
        /** @private {RegExp} */
        this.spacePartPattern = /^\s$/;
    }

    /**
     * @return {Token}
     */
    read() {
        try {

            this._skipSpaces();

            if (this._sourceEndReached()) {
                return createToken(TokenType.TT_END);
            }

            const char = this.source[this.position];
    
            if (this._isNumberPart(char)) {
                return this._readNumber();
            }

            this.position++;

            switch (char) {
                case '+':
                    return createToken(TokenType.TT_PLUS);
                case '-':
                    return createToken(TokenType.TT_MINUS);
                case '*':
                    return createToken(TokenType.TT_MUL);
                case '/':
                    return createToken(TokenType.TT_DIV);
            }

            return createToken(TokenType.TT_ERROR);
        } catch (e) {
            if (e instanceof TokenError) {
                return createToken(TokenType.TT_ERROR);
            }    
            throw e;            
        }
    }

    _skipSpaces() {
        while (this._isSpace(this.source[this.position])) {
            this.position++;
        }
    }

    /** 
     * @private 
     */
    _readNumber() {
        return createToken(TokenType.TT_NUMBER, this._readNumberValue());
    }

    /**
     * @private
     * @return {string}
     * @throws {TokenError}
     */
    _readNumberValue() {
        let value = '';
        let char = this.source[this.position];
        while ((this._isNumberPart(char) || this._isFractionalDivisor(char)) && !this._sourceEndReached()) {
            value += char;
            this.position++;
            if (this.source[this.position] === undefined) {
                break;
            }
            char = this.source[this.position];
        }
        this._validateNumber(value);
        return value;
    }

    /**
     * @private
     * @param {string} number
     * @throws {TokenError}
     */
    _validateNumber(number) {
        // Number can start with 0 only if second char is fractional divisor 
        if (!number.length || number.length > 1 && number[0] === '0' && number[1] !== FRACTIONAL_DIVISOR) {
            throw new TokenError();
        }

        // Fractional divisor must be between digits
        if (number[0] === FRACTIONAL_DIVISOR || number[number.length - 1] === FRACTIONAL_DIVISOR) {
            throw new TokenError();
        }
    }

    _sourceEndReached() {
        return this.position >= this.source.length;
    }

    /**
     * @param {string} char 
     * @private 
     */
    _isSpace(char) {
        return this.spacePartPattern.test(char);
    }

    /**
     * @param {string} char 
     * @private 
     */
    _isNumberPart(char) {
        return this.numberPartPattern.test(char);
    }

    /**
     * @param {string} char 
     */
    _isFractionalDivisor(char) {
        return char === FRACTIONAL_DIVISOR;
    }
}

module.exports = CalcLexer;