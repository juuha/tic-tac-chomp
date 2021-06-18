module.exports = async (bot, message, button_id, user) => {
    let game = bot.games[message.id]

    if (game.players[game.turn].id != user.id) {
        console.log("users didn't match")
        return
    }

    let buttons = {}
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 5; j++) {
            let btn = message.components[i].components[j]
            buttons[btn.custom_id] = btn
        }
    }

    if (game.chosen) {
        let chosen = game.board[game.chosen].pop()
        game.board[button_id].push(chosen)

        let result = checkWin(game.board)
        if (result) {
            switch (result) {
                case "blue": {
                    message.channel.send("Blue won!")
                    return
                }
                case "red": {
                    message.channel.send("Red won!")
                    return
                }
                default: {
                    message.channel.send("It was a tie.")
                    return
                }
            }
        } else {
            game.chosen = ""
            game.turn = (game.turn + 1) % 2
        }
    } else {
        game.chosen = button_id
    }
}

checkWin = async (board) => {
    let result = ""

    // rows
    for (let i = 1; i <= 3; i++) {
        if (!(board[i + "1"] && board[i + "2"] && board[i + "3"])) continue
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
        if (!(board["1" + i] && board["2" + i] && board["3" + i])) continue
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
    if (board["11"] && board["22"] && board["33"]) {
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
    if (board["13"] && board["22"] && board["13"]) {
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