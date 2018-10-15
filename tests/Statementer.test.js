const Statementer = require('../src/Statementer.js');
const {TokenType, createToken} = require('../src/Token.js');
const {Readable, Writable} = require('stream');

/**
 * @param {Token[]} tokens 
 * @return {Promise<number[]>}
 */
function getStatements(tokens) {
    return new Promise(function(resolve){
        const results = [];
        const TokensIn = new Readable({objectMode: true});
        TokensIn._read = () => {};
        const StatementsOut = new Writable({objectMode: true});
        StatementsOut._write = function(result, enc, callback) {
            results.push(result);
            callback();
        };
        StatementsOut.on('finish', function() {
            resolve(results);
        });

        TokensIn
            .pipe(new Statementer())
            .pipe(StatementsOut);

        tokens.forEach(token => TokensIn.push(token));
        TokensIn.push(null);
    });
}

describe('Statementer', () => {

    it('Divides tokens into statements', async () => {
        expect(await getStatements([
            createToken(TokenType.NUMBER, '1'),
            createToken(TokenType.STMT_END),
            createToken(TokenType.NUMBER, '2'),
            createToken(TokenType.NUMBER, '3'),
            createToken(TokenType.STMT_END),
            createToken(TokenType.END)
        ])).toEqual([
            [createToken(TokenType.NUMBER, '1')],
            [createToken(TokenType.NUMBER, '2'), createToken(TokenType.NUMBER, '3')],
            []
        ]);
    });

    it('Reads empty token list as single emty statement', async () => {
        expect(await getStatements([
            createToken(TokenType.END)
        ])).toEqual([
            []
        ]);
    });

});