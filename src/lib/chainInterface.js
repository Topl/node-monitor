const fetch = require('node-fetch')

async function MononChainInfo(url) {
    try {
        const route = `http://${url}/debug/info`;
        const payload = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
        };
        const response = await (await fetch(route, payload)).json();
        if (response.error) { throw response }
        else { return response }

    } catch (err) {
        throw err
    }
};

module.exports = (url) => {
    return MononChainInfo(url)
        .then(res => {
            return {
                result: res.data
            }
        })
        .catch(console.error)
}