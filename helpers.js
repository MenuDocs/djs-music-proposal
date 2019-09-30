const axios = require('axios');

async function getSongs(identifier) {
    const node = lavalink.nodes.first(); // lavalink is a global variable

    const {data} = await axios.get(`http://${node.host}:${node.port}/loadtracks`, {
        params: {
            identifier,
        },
        headers: {
            Authorization: node.password
        },
    });

    return data.tracks;
}

module.exports = {
    getSongs,
};
