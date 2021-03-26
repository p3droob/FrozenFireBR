const Discord = require('discord.js');
const client = new Discord.Client();
const logger = require("./src/utils/logger.js");

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

const modules = ["information"];
const fs = require('fs');

modules.forEach((x) => {
  fs.readdir('./src/commands/$(x)/', (err, files) =>{
    if(err) return Logger.error(err);
    logger.sucess(
      `(COMANDOS): Foram carregados ${files.length} comando(s) na pasta ${x}`)
  })

  files.forEach((f) => {
    const props = require(`./src/commands/${x}/${f}`);
    client.commands.set(props.help.name, props);
    props.help.aliases.forEach((alias) => {
      client.aliases.set(alias, props.help.name);
    })
  })
})

fs.readdir("./src/client/events", (err, files) => {
  if(err) return logger.error(err);
  files.forEach((file) => {
    const event = require(`./src/client/eventes/${file}`);
    let eventName = file.split(".")[0];
    client.commands(eventName, event.bind(null, client));
    delete require.cache(require.resolve(`./src/client/events/${file}`));
  });
});

client.login(process.env.TOKEN).then(() => {
  logger.sucess(`(BOT): Index carregada com sucesso.`)
})