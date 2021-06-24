const fs = require('fs')

module.exports = async (chomper) => {
    let chompers = require('../chompers.json')
    chompers[chomper.id] = chomper
    fs.writeFile('./chompers.json', JSON.stringify(chompers, null, 4), async (error) => {
        if (error) console.log(error)
    })
}
