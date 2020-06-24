require('dotenv').config()

module.exports = {
    sgApiKey: process.env.SENDGRID_API_KEY,
    alertEmailAddr: process.env.ALERT_EMAIL_ADDR,
    nodes: process.env.NODES.split(','),
    healthCheckPeriod: process.env.HEALTHCHECK_PERIOD || 300000, // 5 minutes in ms
    retryHealthCheck: process.env.RETRY_HEALTH || 30000, // 30 seconds in ms
    numberOfFails: process.env.NUM_FAILS || 4,
    notifyExpiration: process.env.NOTIFY_EXPIRY || 21600000, // 6 hours in ms
    blockCreationTimeout: process.env.BLOCK_TIMEOUT || 300000, // 5 minutes in ms (timeout on block creation not occuring)
}