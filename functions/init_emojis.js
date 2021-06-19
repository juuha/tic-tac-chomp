module.exports = async (bot) => {
    let emojis = {}

    emojis.blank = "✴️"

    emojis.small_red = "🔺"
    const small_red = bot.emojis.cache.find(emoji => emoji.name === "small_red")
    if (small_red) emojis.small_red = small_red

    emojis.small_blue = "🔹"
    const small_blue = bot.emojis.cache.find(emoji => emoji.name === "small_blue")
    if (small_blue) emojis.small_blue = small_blue

    emojis.medium_red = "⭕"
    const medium_red = bot.emojis.cache.find(emoji => emoji.name === "medium_red")
    if (medium_red) emojis.medium_red = medium_red

    emojis.medium_blue = "🔷"
    const medium_blue = bot.emojis.cache.find(emoji => emoji.name === "medium_blue")
    if (medium_blue) emojis.medium_blue = medium_blue

    emojis.large_red = "🔴"
    const large_red = bot.emojis.cache.find(emoji => emoji.name === "large_red")
    if (large_red) emojis.large_red = large_red

    emojis.large_blue = "🔵"
    const large_blue = bot.emojis.cache.find(emoji => emoji.name === "large_blue")
    if (large_blue) emojis.large_blue = large_blue

    emojis.red = "🔴"
    emojis.blue = "🔵"

    return emojis
}
