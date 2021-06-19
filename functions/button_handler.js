const { MessageButton, MessageActionRow } = require('discord-buttons')

module.exports = async (bot, message, button_id, user) => {
    let game = bot.games[message.id]

    if (game.players[game.turn].id != user.id) {
        console.log("users didn't match")
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

        let result = checkWin(game.board)

        switch (result) {
            case 0: {
                message.channel.send("Red won!")
                break
            }
            case 1: {
                message.channel.send("Red won!")
                break
            }
            case "tie": {
                message.channel.send("It was a tie.")
                break
            }
            default: {
                game.chosen = ""
                game.turn = (game.turn + 1) % 2
            }
        }
    } else {
        game.chosen = button_id
    }

    let buttons = await setButtons(game, message)

    let row1 = new MessageActionRow()
        .addComponents(buttons[11], buttons[12], buttons[13], buttons[14], buttons[15])

    let row2 = new MessageActionRow()
        .addComponents(buttons[21], buttons[22], buttons[23], buttons[24], buttons[25])

    let row3 = new MessageActionRow()
        .addComponents(buttons[31], buttons[32], buttons[33], buttons[34], buttons[35])

    try {
        message.edit(message.content, { components: [row1, row2, row3] })
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
    if (board["13"].length && board["22"].length && board["13"].length) {
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

setButtons = async (game, message) => {
    let buttons = {}
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 5; j++) {
            let btn = message.components[i].components[j]
            buttons[btn.custom_id] = btn
        }
    }

    let chosen = null
    if (game.chosen) {
        chosen = game.board[game.chosen][game.board[game.chosen].length - 1]
    }
    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
            if (chosen) {
                if (!game.board["" + i + j].length) {
                    buttons["" + i + j].disabled = false
                } else if (game.board["" + i + j][game.board["" + i + j].length - 1].size < chosen.size) {
                    buttons["" + i + j].disabled = false
                } else {
                    buttons["" + i + j].setDisabled()
                }
            } else {
                if (game.board["" + i + j].length) {
                    if (game.board["" + i + j][game.board["" + i + j].length - 1].color == game.turn) {
                        buttons["" + i + j].disabled = false
                    } else {
                        buttons["" + i + j].setDisabled()
                    }
                } else {
                    buttons["" + i + j].setDisabled()
                }
                if (game.board["" + i + j].length) {
                    buttons["" + i + j].setLabel(`${game.board["" + i + j][game.board["" + i + j].length - 1].emoji}`)
                } else {
                    buttons["" + i + j].setLabel(`${"" + ((i - 1) * 3 + (j - 1) + 1)}`)
                }
            }
        }
    }

    let size = { "1": "tiny", "2": "medium", "3": "large" }
    for (let i = 1; i <= 3; i++) {
        for (let j = 4; j <= 5; j++) {
            if (chosen) {
                buttons["" + i + j].setDisabled()
            } else {
                if (game.board["" + i + j].length) {
                    if (game.board["" + i + j][game.board["" + i + j].length - 1].color == game.turn) {
                        buttons["" + i + j].disabled = false
                    } else {
                        buttons["" + i + j].setDisabled()
                    }
                } else {
                    buttons["" + i + j].setDisabled()
                }
            }
            buttons["" + i + j].setLabel(`${game.board["" + i + j].length}x ${size[i]}`)
        }
    }

    if (chosen) {
        buttons[game.chosen].disabled = false
        buttons[game.chosen].setLabel("Cancel move.")
    }

    return buttons
}