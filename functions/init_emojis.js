module.exports = async (bot) => {
    let emojis = {}

    emojis.red = "🔴"

    emojis.blue = "🔵"
    
    emojis.blank = "✴️"
    const blank_emoji = bot.emojis.cache.find(emoji => emoji.name === 'blank')
    if (blank_emoji) emojis.blank = blank_emoji

    return emojis
}
