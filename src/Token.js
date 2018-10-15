const TokenType = {
    END: 0,
	ERROR: 1,
    NUMBER: 2,
    ID: 3,
    PLUS: 4,
    MINUS: 5,
    MUL: 6,
    DIV: 7,
    ASSIGN: 8,
    STMT_END: 9
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