class TokenError extends Error {
    constructor(message, tokenValue) {
      super(message);
      this.name = 'TokenError';
      this.tokenValue = tokenValue;
    }
}

module.exports = TokenError;
