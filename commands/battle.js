const { MessageButton, MessageActionRow } = require('discord-buttons');

module.exports.run = async (bot, message, args) => {
    var message_copy = message
    try {
        message.delete()
    } catch (error) { console.error(error) }

    let new_message = "yo"
    let buttons = {}
    let count = 1

    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
            let button = new MessageButton()
                .setStyle('grey')
                .setLabel("" + count)
                .setID("" + i + j)

            count++
            buttons["" + i + j] = button
        }
    }

    let sizes = ["", "2x small", "2x medium", "2x humongous"]
    for (let i = 1; i <= 3; i++) {
        let buttonRed = new MessageButton()
            .setStyle('red')
            .setLabel(sizes[i])
            .setID("" + i + 4)

        let buttonBlue = new MessageButton()
            .setStyle('blurple')
            .setLabel(sizes[i])
            .setID("" + i + 5)

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
    } catch (error) { console.log(error) }
}

module.exports.help = {
    name: "battle",
    short: "b"
}