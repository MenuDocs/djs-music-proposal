const axios = require('axios');

const getSongs = async (identifier) => {
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

const decodeTrack = async (track) => {
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
