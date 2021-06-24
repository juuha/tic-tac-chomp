const Discord = require("discord.js")
const init_emojis = require("../functions/init_emojis.js")
const init_chompers = require("../functions/init_chomper.js")
const chompers = require('../chompers.json')

module.exports.run = async (bot, message, args) => {
    let message_copy = message
    try {
        await message.delete()
    } catch (error) { console.log(error) }

    let chomper = await init_chompers(message_copy.author)
    let leaderboard = []

    for (let id in chompers) {
        let c = chompers[id]
        leaderboard.push({ name: c.name, wins: c.wins, losses: c.losses, ties: c.ties, ratio: (c.wins/c.losses).toFixed(3) })
    }
    leaderboard.sort((a, b) => (a.ratio < b.ratio) ? 1 : -1)
    let max = Math.min(5, leaderboard.length)

    let rank = leaderboard.findIndex(g => g.name === chomper.name) + 1
    let emojis = await init_emojis(bot)
    let names = ""
    let stats = ""
    let ratio = ""

    for (let i = 0; i < max; i++) {
        let g = leaderboard[i]
        names += `${i + 1}.\u2800${g.name}\n`
        stats += `${g.wins}${emojis.large_red}\u2800${g.losses}${emojis.small_blue}\u2800${g.ties}${emojis.medium_blue}${emojis.medium_red}\n`
        ratio += `${g.ratio}${emojis.small_red}${emojis.large_blue}\n`
    }

    if (rank > max) {
        names += `...\n${rank}.\u2800${chomper.name}`
        stats += `\n${g.wins}${emojis.large_red}\u2800${g.losses}${emojis.small_blue}\u2800${g.ties}${emojis.medium_blue}${emojis.medium_red}`
        ratio += `\n${g.ratio}${emojis.small_red}${emojis.large_blue}`
    }

    const embed = new Discord.MessageEmbed()
        .setTitle(`${emojis.large_red} Leaderboard ${emojis.large_blue}`)
        .addFields(
            { name: 'Name', value: names, inline: true },
            { name: `Wins, losses and ties`, value: stats, inline: true },
            { name: `W/L ratio`, value: ratio, inline: true },
        )
        .setColor(0xffd700)

    try {
        message_copy.channel.send(embed)
    } catch (error) { console.log(error) }
}

module.exports.help = {
    name: "leaderboard",
    short: "lb"
}