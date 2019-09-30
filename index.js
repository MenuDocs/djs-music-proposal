const { Client } = require('discord.js');
const bot = new Client({
    fetchAllMembers: false,
    disableEveryone: true,
});
const { PlayerManager } = require('discord.js-lavalink');
const config = require('./config');
const { getSongs, decodeTrack } = require('./helpers');
const channelId = '566131860913127424';

bot.once('ready', () => {
    global.lavalink = new PlayerManager(bot, config.nodes, {
        user: bot.user.id,
        shards: 0
    });

    console.log('Bot is ready');
}).on('error', console.error).on('warn', console.warn);

bot.on('message', async (msg) => {
    if (msg.author.bot || !msg.guild) return;
    if (!msg.content.startsWith(config.prefix)) return;

    const args = msg.content.slice(config.prefix.length).trim().split(/\s+/g);
    const command = args.shift().toLowerCase();

    if (command === 'play') {
        return playCommand(args, msg);
    }

    if (command === 'leave') {
        await lavalink.leave(msg.guild.id);
        return msg.reply('Successfully left the voice channel');
    }

    if (command === 'pause') {
        const player = lavalink.get(msg.guild.id);
        if (!player) {
            return msg.reply('No lavalink player found');
        }

        await player.pause(!player.paused);

        // Paused is not updated so we have to invert it here
        return msg.reply(`${!player.paused ? 'Resumed' : 'Paused'} the music`);
    }

    if (command === 'volume') {
        const player = lavalink.get(msg.guild.id);
        if (!player) {
            return msg.reply('No lavalink player found');
        }

        if (!player.playing) {
            return msg.reply('The player is not playing anything');
        }

        await player.volume(Number(args[0]));

        return msg.reply(`Volume has been set to **${args[0]}**`);
    }

    if (command === 'np') {
        const player = lavalink.get(msg.guild.id);
        if (!player) {
            return msg.reply('No lavalink player found');
        }

        if (!player.playing) {
            return msg.reply('The player is not playing anything');
        }

        const track = await decodeTrack(player.track);

        return msg.reply(`Now playing: **${track.title}**\nLink: <${track.uri}>`);
    }
});

async function playCommand(args, msg) {
    const [song] = await getSongs('https://www.youtube.com/watch?v=nRu6AgOFvqo');

    if (!song) {
        return msg.reply('No songs found. try again!');
    }

    const player = await lavalink.join({
        guild: msg.guild.id,
        channel: channelId,
        host: lavalink.nodes.first().host
    }, { selfdeaf: true });

    if (!player) {
        return msg.reply('Could not join');
    }

    player.play(song.track);

    player.once('error', console.error);
    player.once('end', async (data) => {
        if (data.reason === 'REPLACED') {
            return;
        }

        msg.channel.send('Song has ended...');
        await player.leave(msg.guild.id);
    });

    return msg.reply(`Now playing: **${song.info.title}** by *${song.info.author}*`);
}

bot.login(config.token).catch(console.error);
