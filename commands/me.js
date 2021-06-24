const Discord = require("discord.js")
const init_chomper = require("../functions/init_chomper.js")
const init_emojis = require("../functions/init_emojis.js")

module.exports.run = async (bot, message) => {
    let message_copy = message
    try {
        message.delete()
    } catch (error) { console.log(error) }

    let chomper = await init_chomper(message_copy.author)
    let emojis = await init_emojis(bot)
    
    let info = `Wins: ${chomper.wins}\nLosses: ${chomper.losses}\nTies: ${chomper.ties}`

    const embed = new Discord.MessageEmbed()
        .setTitle(`${emojis.small_blue}${emojis.medium_blue}${emojis.large_blue} ${chomper.name} ${emojis.large_red}${emojis.medium_red}${emojis.small_red}`)
        .setColor(0x00FFFF)
        .setDescription(info)
    try {
        await message_copy.channel.send(embed)
    } catch (error) { console.log(error) }
}

module.exports.help = {
    name: "me"
}