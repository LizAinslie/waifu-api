const dateFormat = require('dateformat');

const logLevelMap = {
    e: 1,
    w: 2,
    i: 3,
    d: 4,
};

module.exports = class Logger {
    /**
     * Construct a new logger.
     * @param {string} [namespace='main'] The namespace of this logger. A good usage example is differentiating between threads.
     * @param {string} [logLevel='e'] The maximum level of logs to print.
     */
    constructor(namespace = 'main', logLevel = 'e') {
        this.namespace = namespace;
        this.logLevel = logLevel;
    }

    /**
     * Internal logging method used for abstraction purposes. Never call this manually.
     * @param {string} currentLogLevel
     * @param {string} message
     * @private
     */
    _internalLog(currentLogLevel, message = '') {
        if (logLevelMap[currentLogLevel] <= logLevelMap[this.logLevel])
            console.log(`${dateFormat(new Date(), '"UTC" mm/dd/yy HH:MM:ss', true)} [${this.namespace} ${currentLogLevel}] ${message}`);
    }

    /**
     * Log an error message.
     * @param {string} message The error message to log.
     */
    e(message) {
        this._internalLog('e', message);
    }

    /**
     * Log a warning message.
     * @param {string} message The warning message to log.
     */
    w(message) {
        this._internalLog('w', message);
    }

    /**
     * Log an informational message.
     * @param {string} [message] the informational message to log.
     */
    i(message) {
        this._internalLog('i', message)
    }

    /**
     * Log a debug message.
     * @param {string} [message] The debug message to log.
     */
    d(message) {
        this._internalLog('d', message)
    }
}

