module.exports = async (bot, message, button_id, user) => {
    let game = bot.games[message.id]

    if (game.players[game.turn].id != user.id) {
        console.log("users didn't match")
        return
    }

    let buttons = {}
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 5; j++) {
            let btn = sent.components[i].components[j]
            buttons[btn.custom_id] = btn
        }
    }

    if (game.chosen) {

        // at end
        game.chosen = ""
        game.turn = (game.turn + 1) % 2
    } else {
        game.chosen = button_id
    }
}