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
    for (token = lexer.read(); token.type !== TokenType.END; token = lexer.read()) {
        tokens.push(Object.assign({}, token));
    }
    return tokens;
}

describe('Calculator lexer', () => {

    it('Returns end token for empty string', () => {
        const lexer = new CalcLexer('');
        expect(lexer.read()).toEqual(createToken(TokenType.END));
        expect(lexer.read()).toEqual(createToken(TokenType.END));
    });

    it('Can read single digit number', () => {
        expect(tokenize('7')).toEqual([createToken(TokenType.NUMBER, '7')]);
        expect(tokenize('7a')).toEqual([createToken(TokenType.ERROR, '7a')]);
    });

    it('Can read multiple digit number', () => {
        expect(tokenize('365')).toEqual([createToken(TokenType.NUMBER, '365')]);
        expect(tokenize('3xx65')).toEqual([createToken(TokenType.ERROR, '3xx65')]);
    });
    
    it('Cannot read number with leading zero', () => {
        expect(tokenize('0')).toEqual([createToken(TokenType.NUMBER, '0')]);
        expect(tokenize('0365')).toEqual([createToken(TokenType.ERROR, '0365')]);
    });

    it('Can read one operator', () => {
        expect(tokenize('+')).toEqual([createToken(TokenType.PLUS)]);
    });

    it('Can read expression', () => {
        expect(tokenize('y=0+1/887')).toEqual([
            createToken(TokenType.ID, 'y'),
            createToken(TokenType.EQUALS),
            createToken(TokenType.NUMBER, '0'),
            createToken(TokenType.PLUS),
            createToken(TokenType.NUMBER, '1'),
            createToken(TokenType.DIV),
            createToken(TokenType.NUMBER, '887')
        ]);
    });

    it('Can read fractional numbers', () => {
        expect(tokenize('0.123')).toEqual([createToken(TokenType.NUMBER, '0.123')]);
        expect(tokenize('.123')).toEqual([createToken(TokenType.ERROR, '.123')]);
        expect(tokenize('123.')).toEqual([createToken(TokenType.ERROR, '123.')]);
        expect(tokenize('123.2')).toEqual([createToken(TokenType.NUMBER, '123.2')]);
    });

    it('Can read spaced input', () => {
        expect(tokenize(' 1')).toEqual([createToken(TokenType.NUMBER, '1')]);
        expect(tokenize('1 ')).toEqual([createToken(TokenType.NUMBER, '1')]);
        expect(tokenize(' 1 ')).toEqual([createToken(TokenType.NUMBER, '1')]);
        
        expect(tokenize('\n1')).toEqual([createToken(TokenType.NUMBER, '1')]);
        expect(tokenize('1\n')).toEqual([createToken(TokenType.NUMBER, '1')]);
        expect(tokenize('\n1\n')).toEqual([createToken(TokenType.NUMBER, '1')]);

        expect(tokenize('\t1')).toEqual([createToken(TokenType.NUMBER, '1')]);
        expect(tokenize('1\t')).toEqual([createToken(TokenType.NUMBER, '1')]);
        expect(tokenize('\t1\t')).toEqual([createToken(TokenType.NUMBER, '1')]);

        expect(tokenize('  1v\n\t * 2\n-3%%+ id4\t\t  ')).toEqual([
            createToken(TokenType.ERROR, '1v'),
            createToken(TokenType.MUL),
            createToken(TokenType.NUMBER, '2'),
            createToken(TokenType.MINUS),
            createToken(TokenType.ERROR, '3%%'),
            createToken(TokenType.PLUS),
            createToken(TokenType.ID, 'id4')
        ]);
    });

    it('Can read identifier', () => {
        expect(tokenize('abc')).toEqual([createToken(TokenType.ID, 'abc')]);
        expect(tokenize('a+b*c')).toEqual([
            createToken(TokenType.ID, 'a'),
            createToken(TokenType.PLUS),
            createToken(TokenType.ID, 'b'),
            createToken(TokenType.MUL),
            createToken(TokenType.ID, 'c')
        ]);
    });

});