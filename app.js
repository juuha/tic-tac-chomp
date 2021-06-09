const Discord = require("discord.js")
const Token = require("./token.json")
const Config = require("./config.json")
const fs = require("fs")

const bot = new Discord.Client({ disableEveryone: true, partials: ['MESSAGE'] })
bot.commands = new Discord.Collection()
fs.readdir("./commands/", (error, files) => {
    if (error) console.error(error)
    let jsfiles = files.filter(file => file.split(".").pop() == "js")
    if (jsfiles.length == 0) return
    for (const jsfile of jsfiles) {
        let props = require(`./commands/${jsfile}`)
        for (const key in props.help) {
            console.log(`${props.help[key]} command loaded.`)
            bot.commands.set(props.help[key], props)
        }
    }
})

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online and ready to serve! Running on ${bot.guilds.cache.size} servers!`)
    bot.user.setActivity("#help", { type: "LISTENING" })
    
})

bot.on("message", async (message) => {
    if (message.partial) await message.fetch()
    if (message.channel.type == "dm"
        || (message.author.bot && message.author.id != bot.user.id)) return
    let prefix = Config.prefix
    if (!message.content.startsWith(prefix)) return
    let msgArray = message.content.split(" ")
    let cmd = msgArray[0]
    let args = msgArray.slice(1)
    let cmd_file = bot.commands.get(cmd.slice(prefix.length))
    if (cmd_file) cmd_file.run(bot, message, args)
})

bot.login(Token.token)