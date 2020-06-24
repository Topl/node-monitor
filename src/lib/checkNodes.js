const chainInterface = require('./chainInterface')
const settings = require('./settings');
const genMsg = require('./messageBuilder')
const mailer = require('./mailer')

// this is an object that records when a node error was reported
let lastNotified = {};

const shouldNotify = (nodeUrl) => {
    if (!lastNotified[nodeUrl] || (lastNotified[nodeUrl] + settings.notifyExpiration) < Date.now()) {
        lastNotified[nodeUrl] = Date.now();
        return true
    } else {
        return false
    }
}

const nodeHealthCheck = async (nodeUrl, trial) => {
    if (trial > settings.numberOfFails && shouldNotify(nodeUrl)) {
        mailer(genMsg(`The node at ${nodeUrl} has failed ${settings.numberOfFails} consecutive attempts to query the chain info.`))

        throw new Error('Too many attempts. An email has been sent and the error recorded.')

    } else {
        try {
            const response = await chainInterface(nodeUrl)
            return response.result.height

        } catch (err) {
            trial++
            console.log(`[${new Date(Date.now()).toISOString()}] A trial has failed for the node at ${nodeUrl}. Waiting ${settings.retryHealthCheck / 1000} seconds for the next attempt - trial: ${trial}`)
            setTimeout(() => nodeHealthCheck(nodeUrl, trial).catch(err => console.log(`Trial: ${trial} has also errored`)), settings.retryHealthCheck)
        }
    }
}

const checkNodes = async (nodes) => {
    const heights = nodes.map(node => nodeHealthCheck(node, 0).then(height => {
        console.log(`[${new Date(Date.now()).toISOString()}] The node at ${node} responded at the height of ${height}`);
        return height
    }).catch(err => {
        console.log(`[${new Date(Date.now()).toISOString()}] An error occured querying ${node}`)
        return NaN
    }))
    const maxHeight = Math.max(heights);

    nodes.forEach((node, index) => {
        const delta = maxHeight - heights[index];
        if (delta > 15 && delta !== NaN && shouldNotify(node)) mailer(genMsg(`The node at ${node} is more than 15 blocks behind the tallest chain.`))
    })
}

module.exports = checkNodes