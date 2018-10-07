const CalcLexer = require('../src/index.js');
const {TokenType, createToken} = require('../src/Token.js')

// TODO Streams instead of strings
// TODO Function instead of class for CalcLexer
// TODO State machine

/**
 * @param {string} str 
 */
function tokenize(str) {
    const lexer = new CalcLexer(str);
    let token;
    const tokens = [];
    for (token = lexer.read(); token.type !== TokenType.TT_END; token = lexer.read()) {
        tokens.push(Object.assign({}, token));
    }
    return tokens;
}

describe('Calculator lexer', () => {

    it('Returns end token for empty string', () => {
        const lexer = new CalcLexer('');
        expect(lexer.read()).toEqual(createToken(TokenType.TT_END));
        expect(lexer.read()).toEqual(createToken(TokenType.TT_END));
    });

    it('Can read single digit number', () => {
        expect(tokenize('7')).toEqual([createToken(TokenType.TT_NUMBER, '7')]);
        expect(tokenize('7a')).toEqual([createToken(TokenType.TT_ERROR)]);
    });

    it('Can read multiple digit number', () => {
        expect(tokenize('365')).toEqual([createToken(TokenType.TT_NUMBER, '365')]);
    });
    
    it('Cannot read number with leading zero', () => {
        expect(tokenize('0')).toEqual([createToken(TokenType.TT_NUMBER, '0')]);
        expect(tokenize('0365')).toEqual([createToken(TokenType.TT_ERROR)]);
    });

    it('Can read one operator', () => {
        expect(tokenize('+')).toEqual([createToken(TokenType.TT_PLUS)]);
    });

    it('Can read expression', () => {
        expect(tokenize('0+1/887')).toEqual([
            createToken(TokenType.TT_NUMBER, '0'),
            createToken(TokenType.TT_PLUS),
            createToken(TokenType.TT_NUMBER, '1'),
            createToken(TokenType.TT_DIV),
            createToken(TokenType.TT_NUMBER, '887')
        ]);
    });

    it('Can read fractional numbers', () => {
        expect(tokenize('0.123')).toEqual([createToken(TokenType.TT_NUMBER, '0.123')]);
        expect(tokenize('.123')).toEqual([createToken(TokenType.TT_ERROR)]);
        expect(tokenize('123.')).toEqual([createToken(TokenType.TT_ERROR)]);
        expect(tokenize('123.2')).toEqual([createToken(TokenType.TT_NUMBER, '123.2')]);
    });

    it('Can read spaced input', () => {
        expect(tokenize(' 1')).toEqual([createToken(TokenType.TT_NUMBER, '1')]);
        expect(tokenize('1 ')).toEqual([createToken(TokenType.TT_NUMBER, '1')]);
        expect(tokenize(' 1 ')).toEqual([createToken(TokenType.TT_NUMBER, '1')]);
        
        expect(tokenize('\n1')).toEqual([createToken(TokenType.TT_NUMBER, '1')]);
        expect(tokenize('1\n')).toEqual([createToken(TokenType.TT_NUMBER, '1')]);
        expect(tokenize('\n1\n')).toEqual([createToken(TokenType.TT_NUMBER, '1')]);

        expect(tokenize('\t1')).toEqual([createToken(TokenType.TT_NUMBER, '1')]);
        expect(tokenize('1\t')).toEqual([createToken(TokenType.TT_NUMBER, '1')]);
        expect(tokenize('\t1\t')).toEqual([createToken(TokenType.TT_NUMBER, '1')]);

        expect(tokenize('  1\n\t * 2\n-3+ 4\t\t  ')).toEqual([
            createToken(TokenType.TT_NUMBER, '1'),
            createToken(TokenType.TT_MUL),
            createToken(TokenType.TT_NUMBER, '2'),
            createToken(TokenType.TT_MINUS),
            createToken(TokenType.TT_NUMBER, '3'),
            createToken(TokenType.TT_PLUS),
            createToken(TokenType.TT_NUMBER, '4')
        ]);
    });

});