const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');
const { sequelize } = require('./database/connection');
const { Channel } = require('./database/models/Channel');
const { noConfiguretedEmbed } = require('./messages/noConfigureted');
const { birthdayMessageSchedule } = require('./schedule/birthday-message');

dotenv.config();
const { TOKEN } = process.env;

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
		console.log(`Loaded command ${command.data.name}`);
	}
	else {
		console.log(`Failed to load command ${file} in ${filePath} with data: ${command.data} and execute: ${command.execute}`);
	}
}

client.once(Events.ClientReady, async c => {
	await sequelize.sync();

	await birthdayMessageSchedule(client);

	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(TOKEN);

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	
	if (!command) {
		console.error('Command not found');
		return;
	}

	if(command.data.name == 'set_channel') {
		await command.execute(interaction);
		return;
	}
	
	const channels = await Channel.findAll({
		where: {
			guild_id: interaction.guildId
		}
	});

	if(channels.length == 0) {
		await interaction.reply({ embeds: [noConfiguretedEmbed] });
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});