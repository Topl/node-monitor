"use strict";

const settings = require('./lib/settings');
const checkNodes = require('./lib/checkNodes');

///// Application main
//-------------------------------------------------------------------------------------
const intId = setInterval(() => {
    console.log('[APP] Starting the health check job');
    checkNodes(settings.nodes);
}, settings.healthCheckPeriod)

///// Allow graceful shutdown
//-------------------------------------------------------------------------------------
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

function shutdown() {
    console.log("Exiting application process");
    clearInterval(intId);
    process.exit(0);
};
