const { Transform } = require('stream');

const WORD_PART_PATTERN = /^([^\+\-\*\/=])$/;

class Worder extends Transform {
    
    constructor(opts) {
        super(opts);
        /** @private {string} */   
        this.wordBuffer = '';

        const that = this;
        this.on('pipe', function(source) {
            source.on('finish', function() {
                that.flushBuffer();
            });
        });
    }

    /**
     * @param {Buffer} buffer
     */
    _transform(buffer, enc, callback) {
        const char = buffer.toString();
        if (WORD_PART_PATTERN.test(char)) {
            this.wordBuffer += char;
        } else {
            this.flushBuffer(); 
            this.push(char);
        }
        callback();
    }

    flushBuffer() {
        if (this.wordBuffer.length > 0) {
            this.push(this.wordBuffer);
            this.wordBuffer = '';
        }
    }
}

module.exports = Worder;