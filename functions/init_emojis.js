const Discord = require('discord.js')

module.exports = async (bot) => {
    let emojis = {}

    emojis.ecto = "🎲"
    const ecto_emoji = bot.emojis.cache.find(emoji => emoji.name === 'ecto')
    if (ecto_emoji) emojis.ecto = ecto_emoji
    
    emojis.blank = "✴️"
    const blank_emoji = bot.emojis.cache.find(emoji => emoji.name === 'blank')
    if (blank_emoji) emojis.blank = blank_emoji

    return emojis
}
