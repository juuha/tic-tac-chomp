const fs = require('fs')

module.exports = async (user) => {
    let chomper = require('../chompers.json')
    if (!chomper[user.id]) {
        chomper[user.id] = {
            id: user.id,
            name: user.username,
            wins: 0,
            losses: 0,
            ties: 0
        }
        fs.writeFile('./chompers.json', JSON.stringify(chomper, null, 4), async (error) => {
            if (error) console.log(error)
        })
    }
    return chomper[user.id]
}
