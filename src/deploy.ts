import { REST, Routes}  from 'discord.js';
import { Bot, DB}  from './config.json';
import fs from 'fs';
import { resolve } from 'path'; 

const rest = new REST({ version: '9' }).setToken(Bot.TOKEN);

const commands:string[] = [];

// Place your client and guild ids here
const clientId = Bot.CLIENT_ID;
const guildId = Bot.GUILD_ID;

const commandFiles = fs.readdirSync(resolve(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// update the refesh and deploy commands
(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
			
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
