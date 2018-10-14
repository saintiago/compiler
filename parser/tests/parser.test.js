const parse = require('../src/index.js');
const {TokenType, createToken} = require('../../common/Token.js');

describe('Parser', () => {

    it('Can parse a number', () => {
        expect(parse([createToken(TokenType.NUMBER, '1')])).toEqual(1);
        expect(parse([createToken(TokenType.NUMBER, '1337')])).toEqual(1337);
    });

});