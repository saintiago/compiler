const TokenType = {
    TT_END: 0,
	TT_ERROR: 1,
	TT_NUMBER: 2,
    TT_PLUS: 3,
    TT_MINUS: 4,
    TT_MUL: 5,
    TT_DIV: 6
	// TODO: add other tokens here.
};

/**
 * @typedef {{type: number, value: string}} Token
 */

/**
 * @param {number} type 
 * @param {string?} value 
 */
function createToken(type, value = undefined) {
    const token = {type};
    value && (token.value = value);
    return token;
}

 module.exports = {TokenType, createToken};