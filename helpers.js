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

async function decodeTrack(track) {
    const node = lavalink.nodes.first(); // lavalink is a global variable

    const {data} = await axios.get(`http://${node.host}:${node.port}/decodetrack`, {
        params: {
            track,
        },
        headers: {
            Authorization: node.password
        },
    });

    return data;
}

module.exports = {
    getSongs,
    decodeTrack,
};
