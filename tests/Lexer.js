const Lexer = require('../src/index.js');
const {TokenType, createToken} = require('../../common/Token.js');
const {Readable, Writable} = require('stream');

// TODO Streams instead of strings
// TODO Function instead of class for CalcLexer
// TODO State machine

/**
 * @param {string} str 
 * @return {Promise<Token[]>}
 */
function tokenize(str) {
    return new Promise(function(resolve){
        const tokens = [];
        const StrIn = new Readable();
        StrIn._read = () => {};
        const TokensOut = new Writable({objectMode: true});
        TokensOut._write = function(token, enc, callback) {
            tokens.push(token);
            callback();
        };
        TokensOut.on('finish', function() {
            resolve(tokens);
        });

        Lexer(StrIn, TokensOut);
        StrIn.push(str);
        StrIn.push(null);
    });
}

describe('Calculator lexer', () => {

    it('Returns end token for empty string', async () => {
        expect.assertions(1);
        expect(await tokenize('')).toEqual([createToken(TokenType.END)]);
    });

    it('Can read single digit number', async () => {
        expect.assertions(2);
        expect(await tokenize('7')).toEqual([createToken(TokenType.NUMBER, '7'), createToken(TokenType.END)]);
        expect(await tokenize('7a')).toEqual([createToken(TokenType.ERROR, '7a'), createToken(TokenType.END)]);
    });

    it('Can read multiple digit number', async () => {
        expect(await tokenize('365')).toEqual([createToken(TokenType.NUMBER, '365'), createToken(TokenType.END)]);
        expect(await tokenize('3xx65')).toEqual([createToken(TokenType.ERROR, '3xx65'), createToken(TokenType.END)]);
    });
    
    it('Cannot read number with leading zero', async () => {
        expect(await tokenize('0')).toEqual([createToken(TokenType.NUMBER, '0'), createToken(TokenType.END)]);
        expect(await tokenize('0365')).toEqual([createToken(TokenType.ERROR, '0365'), createToken(TokenType.END)]);
    });

    it('Can read one operator', async () => {
        expect(await tokenize('+')).toEqual([createToken(TokenType.PLUS), createToken(TokenType.END)]);
    });

    it('Can read expression', async () => {
        expect(await tokenize('y=0+1/887;')).toEqual([
            createToken(TokenType.ID, 'y'),
            createToken(TokenType.ASSIGN),
            createToken(TokenType.NUMBER, '0'),
            createToken(TokenType.PLUS),
            createToken(TokenType.NUMBER, '1'),
            createToken(TokenType.DIV),
            createToken(TokenType.NUMBER, '887'),
            createToken(TokenType.EXPR_END),
            createToken(TokenType.END)
        ]);
    });

    it('Can read fractional numbers', async () => {
        expect(await tokenize('0.123')).toEqual([createToken(TokenType.NUMBER, '0.123'), createToken(TokenType.END)]);
        expect(await tokenize('.123')).toEqual([createToken(TokenType.ERROR, '.123'), createToken(TokenType.END)]);
        expect(await tokenize('123.')).toEqual([createToken(TokenType.ERROR, '123.'), createToken(TokenType.END)]);
        expect(await tokenize('123.2')).toEqual([createToken(TokenType.NUMBER, '123.2'), createToken(TokenType.END)]);
    });

    it('Can read spaced input', async () => {
        expect(await tokenize(' 1')).toEqual([createToken(TokenType.NUMBER, '1'), createToken(TokenType.END)]);
        expect(await tokenize('1 ')).toEqual([createToken(TokenType.NUMBER, '1'), createToken(TokenType.END)]);
        expect(await tokenize(' 1 ')).toEqual([createToken(TokenType.NUMBER, '1'), createToken(TokenType.END)]);
        
        expect(await tokenize('\n1')).toEqual([createToken(TokenType.NUMBER, '1'), createToken(TokenType.END)]);
        expect(await tokenize('1\n')).toEqual([createToken(TokenType.NUMBER, '1'), createToken(TokenType.END)]);
        expect(await tokenize('\n1\n')).toEqual([createToken(TokenType.NUMBER, '1'), createToken(TokenType.END)]);

        expect(await tokenize('\t1')).toEqual([createToken(TokenType.NUMBER, '1'), createToken(TokenType.END)]);
        expect(await tokenize('1\t')).toEqual([createToken(TokenType.NUMBER, '1'), createToken(TokenType.END)]);
        expect(await tokenize('\t1\t')).toEqual([createToken(TokenType.NUMBER, '1'), createToken(TokenType.END)]);

        expect(await tokenize('  1v\n\t * 2\n-3%%+ id4\t\t  ')).toEqual([
            createToken(TokenType.ERROR, '1v'),
            createToken(TokenType.MUL),
            createToken(TokenType.NUMBER, '2'),
            createToken(TokenType.MINUS),
            createToken(TokenType.ERROR, '3%%'),
            createToken(TokenType.PLUS),
            createToken(TokenType.ID, 'id4'), 
            createToken(TokenType.END)
        ]);
    });

    it('Can read identifier', async () => {
        expect(await tokenize('abc')).toEqual([createToken(TokenType.ID, 'abc'), createToken(TokenType.END)]);
        expect(await tokenize('a+b*c')).toEqual([
            createToken(TokenType.ID, 'a'),
            createToken(TokenType.PLUS),
            createToken(TokenType.ID, 'b'),
            createToken(TokenType.MUL),
            createToken(TokenType.ID, 'c'), 
            createToken(TokenType.END)
        ]);
    });

});