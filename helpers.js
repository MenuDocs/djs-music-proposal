const axios = require('axios');

async function getSongs(identifier, player) {
    const node = player.nodes.first();

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
