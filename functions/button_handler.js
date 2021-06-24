const { MessageButton, MessageActionRow } = require('discord-buttons')
const init_chomper = require('./init_chomper')
const init_emojis = require('./init_emojis')
const update_chomper = require('./update_chomper')

module.exports = async (bot, message, button_id, user) => {
    const game = bot.games[message.id]
    const emojis = await init_emojis(bot)


    if (game.players[game.turn].id != user.id) {
        try {
            const sent = await message.channel.send(`Not your turn ${user.username}! It's ${game.players[game.turn].username}'s turn!`)
            await sent.delete({ timeout: 5000 })
        } catch (error) { console.log(error) }
        return
    }

    step:
    if (game.chosen) {
        if (game.chosen == button_id) {
            game.chosen = ""
            break step
        }
        let chosen = game.board[game.chosen].pop()
        game.board[button_id].push(chosen)

        let result = await checkWin(game.board)
        switch (result) {
            case 0:
            case 1:
            case "tie": {
                await endGame(bot, game, result, message, emojis)
                return
            }
            default: {
                game.chosen = ""
                game.turn = (game.turn + 1) % 2
            }
        }
    } else {
        game.chosen = button_id
    }

    let buttons = await setButtons(game, emojis)

    let row1 = new MessageActionRow()
        .addComponents(buttons[11], buttons[12], buttons[13], buttons[14], buttons[15])

    let row2 = new MessageActionRow()
        .addComponents(buttons[21], buttons[22], buttons[23], buttons[24], buttons[25])

    let row3 = new MessageActionRow()
        .addComponents(buttons[31], buttons[32], buttons[33], buttons[34], buttons[35])

    let new_content = `Tic Tac Chomp! \n**${game.players[0].username}** ${emojis.red} versus **${game.players[1].username}** ${emojis.blue}!\n`
        + `${game.players[game.turn].username}'s turn! ${emojis[["red", "blue"][game.turn]]}`

    try {
        message.edit(new_content, { components: [row1, row2, row3] })
    } catch (error) { console.log(error) }

}

checkWin = async (board) => {
    let result = ""

    // rows
    for (let i = 1; i <= 3; i++) {
        if (!(board[i + "1"].length && board[i + "2"].length && board[i + "3"].length)) continue
        if (board[i + "1"][board[i + "1"].length - 1].color == board[i + "2"][board[i + "2"].length - 1].color
            && board[i + "2"][board[i + "2"].length - 1].color == board[i + "3"][board[i + "3"].length - 1].color) {
            if (result) {
                if (result = board[i + "1"][board[i + "1"].length - 1].color) return "tie"
            } else {
                result = board[i + "1"][board[i + "1"].length - 1].color
            }
        }
    }

    // columns
    for (let i = 1; i <= 3; i++) {
        if (!(board["1" + i].length && board["2" + i].length && board["3" + i].length)) continue
        if (board["1" + i][board["1" + i].length - 1].color == board["2" + i][board["2" + i].length - 1].color
            && board["2" + i][board["2" + i].length - 1].color == board["3" + i][board["3" + i].length - 1].color) {
            if (result) {
                if (result != board["1" + i][board["1" + i].length - 1].color) return "tie"
            } else {
                result = board["1" + i][board["1" + i].length - 1].color
            }
        }
    }

    // diagonal, top left to bottom right
    if (board["11"].length && board["22"].length && board["33"].length) {
        if (board["11"][board["11"].length - 1].color == board["22"][board["22"].length - 1].color
            && board["22"][board["22"].length - 1].color == board["33"][board["33"].length - 1].color) {
            if (result) {
                if (result != board["11"][board["11"].length - 1].color) return "tie"
            } else {
                result = board["11"][board["11"].length - 1].color
            }
        }
    }

    // diagonal, top right to bottom left
    if (board["13"].length && board["22"].length && board["31"].length) {
        if (board["13"][board["13"].length - 1].color == board["22"][board["22"].length - 1].color
            && board["22"][board["22"].length - 1].color == board["31"][board["31"].length - 1].color) {
            if (result) {
                if (result != board["13"][board["13"].length - 1].color) return "tie"
            } else {
                result = board["13"][board["13"].length - 1].color
            }
        }
    }

    return result
}

setButtons = async (game, emojis) => {
    let buttons = {}

    let board_emoji_color_size = {
        "00": emojis.small_red,
        "01": emojis.medium_red,
        "02": emojis.large_red,
        "10": emojis.small_blue,
        "11": emojis.medium_blue,
        "12": emojis.large_blue
    }

    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
            let button = new MessageButton()
                .setStyle('grey')
                .setLabel("" + ((i - 1) * 3 + j))
                .setID("" + i + j)
                .setDisabled()

            if (game.chosen) {
                if (game.board["" + i + j][game.board["" + i + j].length - 1]) {
                    let piece = game.board["" + i + j][game.board["" + i + j].length - 1]
                    button.setEmoji(board_emoji_color_size["" + piece.color + piece.size])
                    button.setLabel("")

                    let chosen_piece = game.board[game.chosen][game.board[game.chosen].length - 1]
                    if (piece.size < chosen_piece.size) {
                        button.setDisabled(false)
                    }
                } else {
                    button.setDisabled(false)
                }
            } else {
                if (game.board["" + i + j][game.board["" + i + j].length - 1]) {
                    let piece = game.board["" + i + j][game.board["" + i + j].length - 1]
                    button.setEmoji(board_emoji_color_size["" + piece.color + piece.size])
                    button.setLabel("")
                    if (piece.color == game.turn) {
                        button.setDisabled(false)
                    }
                }
            }

            buttons["" + i + j] = button
        }
    }

    let bank_emoji_color_size = {
        "14": emojis.small_red,
        "24": emojis.medium_red,
        "34": emojis.large_red,
        "15": emojis.small_blue,
        "25": emojis.medium_blue,
        "35": emojis.large_blue
    }

    for (let i = 1; i <= 3; i++) {
        for (let j = 4; j <= 5; j++) {
            let button = new MessageButton()
                .setStyle('grey')
                .setLabel(` x ${game.board["" + i + j].length}`)
                .setEmoji(bank_emoji_color_size["" + i + j])
                .setID("" + i + j)
                .setDisabled()

            if (!game.chosen) {
                if (game.board["" + i + j][game.board["" + i + j].length - 1]) {
                    let piece = game.board["" + i + j][game.board["" + i + j].length - 1]
                    if (piece.color == game.turn) {
                        button.setDisabled(false)
                    }
                }
            }

            buttons["" + i + j] = button
        }
    }

    if (game.chosen) {
        buttons[game.chosen].disabled = false
        buttons[game.chosen].setLabel("Cancel move.")
        buttons[game.chosen].setEmoji(undefined)

    }

    return buttons
}

endGame = async (bot, game, result, message, emojis) => {
    let new_content = ""
    let challenger = await init_chomper(game.players[0])
    let opponent = await init_chomper(game.players[1])
    let players = [challenger, opponent]

    switch (result) {
        case 0:
        case 1: {
            new_content = `${game.players[result].username} ${emojis[["red", "blue"][result]]} won against ${game.players[(result + 1) % 2].username} ${emojis[["red", "blue"][(result + 1) % 2]]}!`
            players[result].wins++
            players[(result + 1) % 2].losses++
            break
        }
        default: {
            new_content = `Tie between ${game.players[0].username} ${emojis["red"]} and ${game.players[1].username} ${emojis["blue"]}!`
            challenger.ties++
            opponent.ties++
        }
    }

    await update_chomper(challenger)
    await update_chomper(opponent)

    let buttons = {}

    let board_emoji_color_size = {
        "00": emojis.small_red,
        "01": emojis.medium_red,
        "02": emojis.large_red,
        "10": emojis.small_blue,
        "11": emojis.medium_blue,
        "12": emojis.large_blue
    }

    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
            let button = new MessageButton()
                .setStyle('grey')
                .setLabel("" + ((i - 1) * 3 + j))
                .setID("" + i + j)
                .setDisabled()

            if (game.board["" + i + j].length) {
                let piece = game.board["" + i + j][game.board["" + i + j].length - 1]
                button.setEmoji(board_emoji_color_size["" + piece.color + piece.size])
                button.setLabel("")
            }

            buttons["" + i + j] = button
        }
    }

    let bank_emoji_color_size = {
        "14": emojis.small_red,
        "24": emojis.medium_red,
        "34": emojis.large_red,
        "15": emojis.small_blue,
        "25": emojis.medium_blue,
        "35": emojis.large_blue
    }

    for (let i = 1; i <= 3; i++) {
        for (let j = 4; j <= 5; j++) {
            let button = new MessageButton()
                .setStyle('grey')
                .setLabel(` x ${game.board["" + i + j].length}`)
                .setEmoji(bank_emoji_color_size["" + i + j])
                .setID("" + i + j)
                .setDisabled()

            buttons["" + i + j] = button
        }
    }

    let row1 = new MessageActionRow()
        .addComponents(buttons[11], buttons[12], buttons[13], buttons[14], buttons[15])

    let row2 = new MessageActionRow()
        .addComponents(buttons[21], buttons[22], buttons[23], buttons[24], buttons[25])

    let row3 = new MessageActionRow()
        .addComponents(buttons[31], buttons[32], buttons[33], buttons[34], buttons[35])

    try {
        await message.edit(new_content, { components: [row1, row2, row3] })
        delete bot.games[message.id]
    } catch (error) { console.log(error) }
}