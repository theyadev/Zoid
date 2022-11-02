import { Client, GatewayIntentBits, Collection, } from 'discord.js';
import  { readdirSync} from 'fs'; 
import { resolve } from 'path'; 
import { TOKEN } from './config.json';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});
declare module 'discord.js' {
    interface Client {
        commands: Collection<unknown, any>;
    }
}

client.commands = new Collection();

// get all command files 
const commandFiles = readdirSync(resolve(__dirname, 'commands')).filter(file => file.endsWith('.js')); 
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// listen for client events and run the event file
const eventFiles = readdirSync(resolve(__dirname, 'events')).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(TOKEN);


