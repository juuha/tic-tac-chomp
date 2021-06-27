const { MessageButton, MessageActionRow } = require('discord-buttons')
const init_emojis = require('../functions/init_emojis')
const Config = require('../config.json')

module.exports.run = async (bot, message, args) => {
    var message_copy = message
    try {
        message.delete()
    } catch (error) { console.error(error) }

    const emojis = await init_emojis(bot)

    let opponent = null

    if (args[0]) {
        opponent = getUserFromMention(bot, args[0])
        if (!opponent) {
            try {
                let error_message = `${args[0]} is not a user in this server!`
                let sent = await message_copy.channel.send(error_message)
                await sent.delete({ timeout: 10000 })
                return
            } catch (error) { console.log(error) }
        }
    } else {
        try {
            let error_message = `You need to specify your opponent! Usage: ${Config.prefix}battle <@who>`
            let sent = await message_copy.channel.send(error_message)
            await sent.delete({ timeout: 10000 })
            return
        } catch (error) { console.log(error) }
    }

    let game = {
        players: [message_copy.author, opponent],
        chosen: "",
        turn: 0,
        board: {
            "11": [],
            "12": [],
            "13": [],
            "14": [{ name: "tiny red", size: 0, color: 0, emoji: emojis.small_red }, { name: "tiny red", size: 0, color: 0, emoji: emojis.small_red }],
            "15": [{ name: "tiny blue", size: 0, color: 1, emoji: emojis.small_blue }, { name: "tiny blue", size: 0, color: 1, emoji: emojis.small_blue }],
            "21": [],
            "22": [],
            "23": [],
            "24": [{ name: "medium red", size: 1, color: 0, emoji: emojis.medium_blue }, { name: "medium red", size: 1, color: 0, emoji: emojis.medium_red }],
            "25": [{ name: "medium blue", size: 1, color: 1, emoji: emojis.medium_blue }, { name: "medium blue", size: 1, color: 1, emoji: emojis.medium_blue }],
            "31": [],
            "32": [],
            "33": [],
            "34": [{ name: "large red", size: 2, color: 0, emoji: emojis.large_red }, { name: "large red", size: 2, color: 0, emoji: emojis.large_red }],
            "35": [{ name: "large blue", size: 2, color: 1, emoji: emojis.large_blue }, { name: "large blue", size: 2, color: 1, emoji: emojis.large_blue }]
        }
    }

    let new_message = `${emojis.small_red}${emojis.medium_red}${emojis.large_red}${emojis.large_blue}${emojis.medium_blue}${emojis.small_blue}\n**${game.players[0].username}** ${emojis.red} versus **${game.players[1].username}** ${emojis.blue}!\n`
        + `${game.players[game.turn].username}'s turn! ${emojis.red}`

    let buttons = {}
    let count = 1

    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
            let button = new MessageButton()
                .setStyle('grey')
                .setLabel("" + count)
                .setID("" + i + j)
                .setDisabled()

            count++
            buttons["" + i + j] = button
        }
    }

    let reds = ["", emojis.small_red, emojis.medium_red, emojis.large_red]
    let blues = ["", emojis.small_blue, emojis.medium_blue, emojis.large_blue]
    for (let i = 1; i <= 3; i++) {
        let buttonRed = new MessageButton()
            .setStyle('red')
            .setID("" + i + 4)
            .setLabel("x 2")
            .setEmoji(reds[i])

        let buttonBlue = new MessageButton()
            .setStyle('blurple')
            .setLabel("x 2")
            .setEmoji(blues[i])
            .setID("" + i + 5)
            .setDisabled()

        buttons["" + i + 4] = buttonRed
        buttons["" + i + 5] = buttonBlue
    }

    let row1 = new MessageActionRow()
        .addComponents(buttons[11], buttons[12], buttons[13], buttons[14], buttons[15])

    let row2 = new MessageActionRow()
        .addComponents(buttons[21], buttons[22], buttons[23], buttons[24], buttons[25])

    let row3 = new MessageActionRow()
        .addComponents(buttons[31], buttons[32], buttons[33], buttons[34], buttons[35])

    try {
        let sent = await message_copy.channel.send(new_message, { components: [row1, row2, row3] })
        bot.games[sent.id] = game
    } catch (error) { console.log(error) }
}

module.exports.help = {
    name: "battle",
    short: "b"
}

function getUserFromMention(bot, mention) {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }

        return bot.users.cache.get(mention);
    }
}