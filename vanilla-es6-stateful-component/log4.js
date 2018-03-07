
const log4js = require('log4js');

module.exports = function(loggerConfig) {
    const logLevel = loggerConfig.level || 'TRACE';
    const appenders = loggerConfig.appenders || [];
    const replaceConsole = loggerConfig.replaceConsole ;
    if (replaceConsole && (appenders.length>0)) {
        log4js.configure({appenders});
    }

    const std = log4js.getLogger('std') || log4js.getLogger();
    const err = log4js.getLogger('err') || std;
    const exp = log4js.getLogger('exp') || std;
    std.setLevel(logLevel);
    err.setLevel(logLevel);
    exp.setLevel(logLevel);

    return {std,err,exp};
}