const { MessageButton, MessageActionRow } = require('discord-buttons');
const init_emojis = require('../functions/init_emojis');

module.exports.run = async (bot, message, args) => {
    var message_copy = message
    try {
        message.delete()
    } catch (error) { console.error(error) }

    const emojis = await init_emojis(bot)

    let game = {
        players: [message_copy.author, {username: "not me"}],
        chosen: "",
        turn: 0,
        board: {
            "11": [],
            "12": [],
            "13": [],
            "14": ["0_red_tiny", "0_red_tiny"],
            "15": ["0_blue_tiny", "0_blue_tiny"],
            "21": [],
            "22": [],
            "23": [],
            "24": ["1_red_medium", "1_red_medium"],
            "25": ["1_blue_medium", "1_blue_medium"],
            "31": [],
            "32": [],
            "33": [],
            "34": ["2_red_large", "2_red_large"],
            "35": ["2_blue_large", "2_blue_large"]
        }
    }

    let board = {}
    for (let i = 1; i <= 9; i++) {
        board[i] = emojis.blank
    }

    let new_message = `Tic Tac Chomp! \n**${game.players[0].username}** ${emojis.red} vs **${game.players[1].username}** ${emojis.blue}!\n`
        + ` ${board[1]} | ${board[2]} | ${board[3]}\n`
        + "----------------\n"
        + ` ${board[4]} | ${board[5]} | ${board[6]}\n`
        + "----------------\n"
        + ` ${board[7]} | ${board[8]} | ${board[9]}\n\n`
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

    let sizes = ["", "2x tiny", "2x regular", "2x giant"]
    for (let i = 1; i <= 3; i++) {
        let buttonRed = new MessageButton()
            .setStyle('red')
            .setLabel(sizes[i])
            .setID("" + i + 4)

        let buttonBlue = new MessageButton()
            .setStyle('blurple')
            .setLabel(sizes[i])
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