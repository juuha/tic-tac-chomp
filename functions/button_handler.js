module.exports = async (bot, message, button_id, user) => {
    let game = bot.games[message.id]

    let place = game.board[button_id]
    game.chosen = button_id

    
    console.log(bot.games[message.id].chosen)
}