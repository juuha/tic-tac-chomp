const Discord = require("discord.js")
const Config = require('../config.json')
const init_emojis = require("../functions/init_emojis")

module.exports.run = async (bot, message) => {
    let message_copy = message
    try {
        message.delete()
    } catch (error) { console.log(error) }

    let emojis = await init_emojis(bot)

    var dm = await message_copy.author.createDM()
    const embed = new Discord.MessageEmbed()
        .setTitle(`${emojis.small_blue}${emojis.medium_blue}${emojis.large_blue} Tic-Tac-Chomp ${emojis.large_red}${emojis.medium_red}${emojis.small_red}`)
        .setColor(0xFF0000)
        .setDescription(`**${Config.prefix}battle <@name>** - Starts a game with given person. \n **${Config.prefix}me** - Shows information about yourself.\n **${Config.prefix}leaderboard** - Shows the current top chompers (and you if you aren't in the top 5).\n\nThere are shorthand commands for your comfort:\n **${Config.prefix}b** for battle.\n **${Config.prefix}lb** for leaderboard.`)
    try {
        await dm.send(embed)
    } catch (error) { console.error(error) }
}

module.exports.help = {
    name: "help",
    short: "h"
}