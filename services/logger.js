const Logger = require('smart-logs');

const logger = new Logger();

logger.setFormateType("tab");
logger.setSize("30m"); //k, m, g

module.exports = function (moduleName) {
    return logger.getLogger(moduleName);
}