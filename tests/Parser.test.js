const Parser = require('../src/Parser.js');
const {TokenType, createToken} = require('../src/Token.js');
const {Readable, Writable} = require('stream');

/**
 * @param {Token[]} tokens 
 * @return {Promise<number[]>}
 */
function parse(tokens) {
    return new Promise(function(resolve){
        const results = [];
        const TokensIn = new Readable({objectMode: true});
        TokensIn._read = () => {};
        const NumberOut = new Writable();
        NumberOut._write = function(result, enc, callback) {
            results.push(+result.toString());
            callback();
        };
        NumberOut.on('finish', function() {
            resolve(results);
        });

        TokensIn
            .pipe(new Parser())
            .pipe(NumberOut);

        tokens.forEach(token => TokensIn.push(token));
        TokensIn.push(null);
    });
}

describe('Parser', () => {

    it('Can parse a number', async () => {
        expect(await parse([createToken(TokenType.NUMBER, '1')])).toEqual([1]);
        expect(await parse([createToken(TokenType.NUMBER, '1337')])).toEqual([1337]);
    });

    it('Can parse sum expression', async () => {
        expect(await parse([
            createToken(TokenType.NUMBER, '1'),
            createToken(TokenType.PLUS),
            createToken(TokenType.NUMBER, '2')
        ])).toEqual([3]);
    });

});