const settings = require("./settings");

module.exports = (_text) => {
    return {
        to: settings.alertEmailAddr,
        from: 'node-monitor@topl.network',
        subject: `{URGENT] - ${new Date(Date.now()).toISOString()} - Toplnet has encountered an error!`,
        text: _text
    };
}
