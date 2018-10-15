const { Transform } = require('stream');

const NON_SPACE_PATTERN = /^[^\s]+$/;

class Letterer extends Transform {
    _transform(chunk, encoding, callback) {
        [...chunk.toString()].filter(letter => NON_SPACE_PATTERN.test(letter)).forEach(letter => this.push(letter));
        callback();
    }
};

module.exports = Letterer;